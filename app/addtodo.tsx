import { AppButton } from "@/components/ui/app-button";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "todo";
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEK_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const INTENSITY_OPTIONS = [
  "High Priority",
  "Steady Pace",
  "Low Focus",
] as const;

type IntensityOption = (typeof INTENSITY_OPTIONS)[number];

type TodoItem = {
  id: string;
  title: string;
  desc: string;
  dueDate: string;
  date: string;
  intensity: IntensityOption;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

const pad2 = (value: number) => String(value).padStart(2, "0");

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const parseISODate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
};

const addDays = (date: Date, amount: number) => {
  const updated = new Date(date);
  updated.setDate(updated.getDate() + amount);
  return updated;
};

const startOfWeekMonday = (date: Date) => {
  const updated = new Date(date);
  const day = updated.getDay();
  const shift = day === 0 ? -6 : 1 - day;
  updated.setDate(updated.getDate() + shift);
  updated.setHours(0, 0, 0, 0);
  return updated;
};

const parseLegacyDateLabel = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === "today") return toISODate(new Date());

  const match = /^([A-Za-z]{3})\s+(\d{1,2})$/.exec(trimmed);
  if (!match) return null;

  const monthIdx = MONTHS.findIndex(
    (month) => month.slice(0, 3).toLowerCase() === match[1].toLowerCase(),
  );
  if (monthIdx < 0) return null;

  const year = new Date().getFullYear();
  const day = Number(match[2]);
  const parsed = new Date(year, monthIdx, day);
  if (parsed.getMonth() !== monthIdx || parsed.getDate() !== day) return null;
  return toISODate(parsed);
};

const isIntensityOption = (value: unknown): value is IntensityOption =>
  typeof value === "string" &&
  (INTENSITY_OPTIONS as readonly string[]).includes(value);

const formatShortDateLabel = (isoDate: string) => {
  const date = parseISODate(isoDate);
  if (!date) return "Today";
  if (isoDate === toISODate(new Date())) return "Today";
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
};

const normalizeStoredTodo = (raw: unknown): TodoItem => {
  const source = typeof raw === "object" && raw !== null ? raw : {};
  const record = source as Record<string, unknown>;

  const id =
    typeof record.id === "string" && record.id.trim()
      ? record.id
      : `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const title = typeof record.title === "string" ? record.title : "";
  const desc = typeof record.desc === "string" ? record.desc : "";
  const completed = typeof record.completed === "boolean" ? record.completed : false;
  const intensity = isIntensityOption(record.intensity)
    ? record.intensity
    : "Steady Pace";

  const maybeDueDate =
    typeof record.dueDate === "string" && parseISODate(record.dueDate)
      ? record.dueDate
      : null;
  const dueDate =
    maybeDueDate ?? parseLegacyDateLabel(record.date) ?? toISODate(new Date());

  const createdAt =
    typeof record.createdAt === "string" && record.createdAt
      ? record.createdAt
      : new Date().toISOString();
  const updatedAt =
    typeof record.updatedAt === "string" && record.updatedAt
      ? record.updatedAt
      : createdAt;

  return {
    id,
    title,
    desc,
    dueDate,
    date: formatShortDateLabel(dueDate),
    intensity,
    completed,
    createdAt,
    updatedAt,
  };
};

export default function AddTodoScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = typeof taskId === "string" && taskId.length > 0;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [intensity, setIntensity] = useState<IntensityOption>("Steady Pace");
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(new Date()));
  const [loadingTask, setLoadingTask] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !taskId) {
      setLoadingTask(false);
      return;
    }

    let active = true;
    const loadTask = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        const todos = Array.isArray(parsed) ? parsed.map(normalizeStoredTodo) : [];
        const task = todos.find((item) => item.id === taskId);
        if (!active || !task) return;

        setTitle(task.title);
        setDesc(task.desc);
        setIntensity(task.intensity);
        setSelectedDate(task.dueDate);
        const dueDate = parseISODate(task.dueDate);
        if (dueDate) setWeekStart(startOfWeekMonday(dueDate));
      } catch (error) {
        console.log(error);
      } finally {
        if (active) setLoadingTask(false);
      }
    };

    void loadTask();
    return () => {
      active = false;
    };
  }, [isEditing, taskId]);

  const weekDays = useMemo(() => {
    return WEEK_DAY_LABELS.map((label, index) => {
      const date = addDays(weekStart, index);
      return {
        label,
        dayNumber: date.getDate(),
        isoDate: toISODate(date),
      };
    });
  }, [weekStart]);

  const monthYear = useMemo(() => {
    const baseDate = parseISODate(selectedDate) ?? new Date();
    return `${MONTHS[baseDate.getMonth()]} ${baseDate.getFullYear()}`;
  }, [selectedDate]);

  const moveWeek = (direction: -1 | 1) => {
    setWeekStart((current) => {
      const next = addDays(current, direction * 7);
      setSelectedDate(toISODate(next));
      return next;
    });
  };

  const handleSaveTask = async () => {
    if (title.trim() === "") return;

    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      const todos = Array.isArray(parsed) ? parsed.map(normalizeStoredTodo) : [];
      const now = new Date().toISOString();

      if (isEditing && taskId) {
        const existing = todos.find((item) => item.id === taskId);
        const updatedTask: TodoItem = {
          id: taskId,
          title: title.trim(),
          desc: desc.trim(),
          dueDate: selectedDate,
          date: formatShortDateLabel(selectedDate),
          intensity,
          completed: existing ? existing.completed : false,
          createdAt: existing ? existing.createdAt : now,
          updatedAt: now,
        };

        const updatedTodos = todos.some((item) => item.id === taskId)
          ? todos.map((item) => (item.id === taskId ? updatedTask : item))
          : [updatedTask, ...todos];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
      } else {
        const newTask: TodoItem = {
          id: `${Date.now()}`,
          title: title.trim(),
          desc: desc.trim(),
          dueDate: selectedDate,
          date: formatShortDateLabel(selectedDate),
          intensity,
          completed: false,
          createdAt: now,
          updatedAt: now,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newTask, ...todos]));
      }

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
          <Feather name="x" size={20} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? "Edit Task" : "New Task"}</Text>
        <AppButton
          variant="text"
          label={isEditing ? "Update" : "Save"}
          onPress={handleSaveTask}
          disabled={loadingTask}
          labelStyle={[styles.headerAction, loadingTask && { color: "#cbd5e1" }]}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.modalSectionSub}>TASK CREATION</Text>
        <Text style={styles.modalTitleBig}>Define your{"\n"}next move.</Text>

        <Text style={styles.label}>THE OBJECTIVE</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="What needs to be done?"
          placeholderTextColor="#b2b7c2"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>CONTEXT & DETAILS</Text>
        <TextInput
          style={[styles.inputBox, styles.inputBoxDetails]}
          placeholder="Add any specific requirements or links..."
          placeholderTextColor="#b2b7c2"
          multiline
          value={desc}
          onChangeText={setDesc}
        />

        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconSquare}>
              <Feather name="calendar" size={15} color="#64748b" />
            </View>
            <Text style={styles.cardTitle}>TIMELINE</Text>
          </View>

          <View style={styles.timelineMonthRow}>
            <TouchableOpacity onPress={() => moveWeek(-1)} style={styles.chevronBtn}>
              <Feather name="chevron-left" size={18} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.timelineMonthText}>{monthYear}</Text>
            <TouchableOpacity onPress={() => moveWeek(1)} style={styles.chevronBtn}>
              <Feather name="chevron-right" size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.timelineDaysRow}>
            {weekDays.map((day) => {
              const isSelected = selectedDate === day.isoDate;
              return (
                <TouchableOpacity
                  key={day.isoDate}
                  onPress={() => setSelectedDate(day.isoDate)}
                  style={styles.dayButton}>
                  <Text style={styles.weekLabel}>{day.label}</Text>
                  <View style={[styles.dateCircle, isSelected && styles.dateCircleActive]}>
                    <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                      {day.dayNumber}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconSquare, { backgroundColor: "#fce7f3" }]}>
              <Text style={{ color: "#be185d", fontWeight: "700", fontSize: 16 }}>!</Text>
            </View>
            <Text style={styles.cardTitle}>INTENSITY</Text>
          </View>

          {INTENSITY_OPTIONS.map((option) => {
            const isSelected = intensity === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setIntensity(option)}
                style={[styles.radioRow, isSelected && styles.radioRowActive]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioText, isSelected && styles.radioTextActive]}>
                    {option}
                  </Text>
                </View>
                {isSelected && option === "Steady Pace" && (
                  <Feather name="trending-up" size={16} color="#6366f1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <AppButton
          variant="outline"
          label="Cancel"
          style={styles.btnCancel}
          onPress={() => router.back()}
          labelStyle={styles.cancelText}
        />
        <AppButton
          variant="primary"
          label={isEditing ? "Update Task" : "Save Task"}
          style={styles.btnSave}
          onPress={handleSaveTask}
          disabled={loadingTask || title.trim().length === 0}
          labelStyle={styles.saveText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef0f4" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerIconBtn: { padding: 6 },
  headerTitle: { fontSize: 15, fontWeight: "700", color: "#2d313a" },
  headerAction: { fontSize: 15, fontWeight: "700", color: "#6366f1" },
  content: { paddingHorizontal: 20 },
  modalSectionSub: {
    fontSize: 10,
    fontWeight: "800",
    color: "#8f91f8",
    letterSpacing: 1.3,
    marginTop: 8,
  },
  modalTitleBig: {
    fontSize: 46,
    fontWeight: "700",
    color: "#32353d",
    lineHeight: 49,
    marginBottom: 28,
    marginTop: 8,
    letterSpacing: -1.2,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: "#808693",
    letterSpacing: 1.2,
    marginBottom: 9,
    marginLeft: 4,
  },
  inputBox: {
    backgroundColor: "#e8ebf0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 22,
  },
  inputBoxDetails: {
    height: 92,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  cardContainer: {
    backgroundColor: "#fbfbfd",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  cardTitle: { fontSize: 11, fontWeight: "800", color: "#606877", letterSpacing: 1 },
  iconSquare: {
    width: 30,
    height: 30,
    backgroundColor: "#e9edf7",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  timelineMonthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  chevronBtn: { padding: 4 },
  timelineMonthText: { fontSize: 13, fontWeight: "700", color: "#3d4451" },
  timelineDaysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayButton: { alignItems: "center", width: 36 },
  weekLabel: {
    fontSize: 11,
    color: "#9aa0ae",
    fontWeight: "700",
    marginBottom: 8,
  },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  dateCircleActive: { backgroundColor: "#6366f1" },
  dateText: { fontSize: 11, fontWeight: "700", color: "#545b68" },
  dateTextActive: { color: "#fff" },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eef1f5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  radioRowActive: {
    backgroundColor: "#f8f9ff",
    borderWidth: 1.2,
    borderColor: "#6f72f8",
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#aeb4c2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioOuterActive: { borderColor: "#6366f1" },
  radioInner: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#6366f1" },
  radioText: { fontSize: 13, color: "#4d5462", fontWeight: "600" },
  radioTextActive: { color: "#2f3541", fontWeight: "700" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: "#eef0f4",
    borderTopWidth: 1,
    borderColor: "#e3e7ee",
  },
  btnCancel: {
    flex: 1,
    borderRadius: 18,
    marginRight: 10,
    paddingVertical: 15,
    backgroundColor: "#eef0f4",
    borderColor: "#e1e6ee",
  },
  btnSave: {
    flex: 2.1,
    borderRadius: 18,
    paddingVertical: 15,
    shadowColor: "#6366f1",
    shadowOpacity: 0.35,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 5 },
  },
  cancelText: { fontWeight: "700", color: "#5f6673", fontSize: 14 },
  saveText: { fontWeight: "700", color: "#fff", fontSize: 14 },
});

