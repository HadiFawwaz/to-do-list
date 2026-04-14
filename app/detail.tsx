import { AppButton } from "@/components/ui/app-button";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "todo";
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const INTENSITY_OPTIONS = [
  "High Priority",
  "Steady Pace",
  "Low Focus",
] as const;

type IntensityOption = (typeof INTENSITY_OPTIONS)[number];

type TodoSubtask = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoItem = {
  id: string;
  title: string;
  desc: string;
  dueDate: string;
  intensity: IntensityOption;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks: TodoSubtask[];
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

const defaultSubtasks = (title: string): TodoSubtask[] => [
  {
    id: "sub-1",
    title: `Break down ${title || "deliverables"} into milestones`,
    completed: false,
  },
  {
    id: "sub-2",
    title: "Draft notes and execution approach",
    completed: false,
  },
  {
    id: "sub-3",
    title: "Review and finalize output",
    completed: false,
  },
];

const normalizeSubtasks = (raw: unknown, taskTitle: string): TodoSubtask[] => {
  if (!Array.isArray(raw)) return defaultSubtasks(taskTitle);
  const parsed = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const title =
        typeof record.title === "string" && record.title.trim()
          ? record.title
          : null;
      if (!title) return null;
      return {
        id:
          typeof record.id === "string" && record.id.trim()
            ? record.id
            : `sub-${index + 1}`,
        title,
        completed: Boolean(record.completed),
      };
    })
    .filter((item): item is TodoSubtask => Boolean(item));
  return parsed.length > 0 ? parsed : defaultSubtasks(taskTitle);
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
    intensity,
    completed,
    createdAt,
    updatedAt,
    subtasks: normalizeSubtasks(record.subtasks, title),
  };
};

const formatReadableDate = (isoDate: string) => {
  const date = parseISODate(isoDate);
  if (!date) return "Today";
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
};

const intensityBadge = (intensity: IntensityOption) => {
  if (intensity === "High Priority") {
    return { text: "HIGH PRIORITY", bg: "#f7e7f8", color: "#b532c4" };
  }
  if (intensity === "Steady Pace") {
    return { text: "STEADY PACE", bg: "#e9ecff", color: "#5c63e8" };
  }
  return { text: "LOW FOCUS", bg: "#e9edf4", color: "#6f7786" };
};

export default function DetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [task, setTask] = useState<TodoItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // TAMBAHAN: State untuk menangani form input subtask baru
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadTask = async () => {
        if (!taskId) {
          setTask(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed: unknown = saved ? JSON.parse(saved) : [];
          const todos = Array.isArray(parsed) ? parsed.map(normalizeStoredTodo) : [];
          const found = todos.find((item) => item.id === taskId) ?? null;
          setTask(found);
        } catch (error) {
          console.log(error);
          setTask(null);
        } finally {
          setLoading(false);
        }
      };

      void loadTask();
    }, [taskId]),
  );

  const persistUpdatedTask = async (updater: (task: TodoItem) => TodoItem) => {
    if (!task) return;
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    const todos = Array.isArray(parsed) ? parsed.map(normalizeStoredTodo) : [];
    const updatedTodos = todos.map((item) => {
      if (item.id !== task.id) return item;
      return updater(item);
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    const updatedSelf = updatedTodos.find((item) => item.id === task.id) ?? null;
    setTask(updatedSelf);
  };

  const toggleTaskComplete = async () => {
    await persistUpdatedTask((current) => ({
      ...current,
      completed: !current.completed,
      updatedAt: new Date().toISOString(),
    }));
  };

  const toggleSubtask = async (subtaskId: string) => {
    await persistUpdatedTask((current) => ({
      ...current,
      subtasks: current.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask,
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  // TAMBAHAN: Fungsi ini sekarang mengambil value dari input
  const submitNewSubtask = async () => {
    if (!newSubtaskTitle.trim()) {
      setIsAddingSubtask(false);
      return;
    }
    
    await persistUpdatedTask((current) => ({
      ...current,
      subtasks: [
        ...current.subtasks,
        {
          id: `sub-${Date.now()}`,
          title: newSubtaskTitle.trim(),
          completed: false,
        },
      ],
      updatedAt: new Date().toISOString(),
    }));
    
    setNewSubtaskTitle("");
    setIsAddingSubtask(false);
  };

  const deleteTask = () => {
    if (!task) return;
    Alert.alert("Delete task?", "Task ini akan dihapus permanen.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed: unknown = saved ? JSON.parse(saved) : [];
          const todos = Array.isArray(parsed) ? parsed.map(normalizeStoredTodo) : [];
          const updated = todos.filter((item) => item.id !== task.id);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          router.back();
        },
      },
    ]);
  };

  const shortHeaderTitle = useMemo(() => {
    if (!task?.title) return "Task Details";
    const words = task.title.split(" ").filter(Boolean);
    return words.slice(0, 2).join(" ");
  }, [task?.title]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <Text style={styles.emptyText}>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <Text style={styles.emptyText}>Task not found.</Text>
          <AppButton
            variant="text"
            label="Back"
            onPress={() => router.back()}
            labelStyle={{ color: "#6366f1", fontSize: 15 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const badge = intensityBadge(task.intensity);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{shortHeaderTitle}</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.push({ pathname: "/addtodo", params: { id: task.id } })}>
          <Feather name="edit-2" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.badgeRow}>
          <View style={[styles.tag, { backgroundColor: badge.bg }]}>
            <Text style={[styles.tagText, { color: badge.color }]}>{badge.text}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: "#dbe2ee" }]}>
            <Text style={[styles.tagText, { color: "#64748b" }]}>DEEP WORK</Text>
          </View>
        </View>

        <Text style={styles.taskTitle}>{task.title}</Text>

        <View style={styles.timeRow}>
          <View style={styles.timeItem}>
            <Feather name="calendar" size={12} color="#8b93a3" />
            <Text style={styles.timeText}>{formatReadableDate(task.dueDate)}</Text>
          </View>
          <View style={styles.timeItem}>
            <Feather name="clock" size={12} color="#8b93a3" />
            <Text style={styles.timeText}>4:00 PM</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PROJECT SCOPE</Text>
        <Text style={styles.scopeText}>
          {task.desc ||
            "This task involves a comprehensive review of the current structure and execution details. We need to ensure each section is clean, focused, and ready for final delivery."}
        </Text>

        

        <Text style={styles.sectionLabel}>EXECUTION ROADMAP</Text>
        <View style={styles.subtasksWrap}>
          {task.subtasks.map((subtask) => (
            <TouchableOpacity
              key={subtask.id}
              style={styles.subtaskRow}
              activeOpacity={0.9}
              onPress={() => {
                void toggleSubtask(subtask.id);
              }}>
              <View
                style={[
                  styles.subtaskCheck,
                  subtask.completed && styles.subtaskCheckActive,
                ]}>
                {subtask.completed && (
                  <Feather name="check" size={11} color="#fff" />
                )}
              </View>
              <Text style={styles.subtaskText}>{subtask.title}</Text>
              {!subtask.completed && (
                <Feather name="paperclip" size={13} color="#9ba3b2" />
              )}
            </TouchableOpacity>
          ))}
          
          {/* TAMBAHAN: UI Dinamis untuk menginput subtask */}
          {isAddingSubtask ? (
            <View style={styles.addSubtaskInputContainer}>
              <TextInput
                style={styles.addSubtaskInput}
                value={newSubtaskTitle}
                onChangeText={setNewSubtaskTitle}
                placeholder="What needs to be done?"
                placeholderTextColor="#a1a8b6"
                autoFocus
                onSubmitEditing={submitNewSubtask}
                onBlur={() => {
                  if (!newSubtaskTitle.trim()) setIsAddingSubtask(false);
                }}
              />
              <TouchableOpacity onPress={submitNewSubtask} style={styles.addSubtaskSaveBtn}>
                <Text style={styles.addSubtaskSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addSubtaskBtn}
              onPress={() => setIsAddingSubtask(true)}>
              <Text style={styles.addSubtaskText}>+ Add Subtask</Text>
            </TouchableOpacity>
          )}

        </View>

        
      </ScrollView>

      <View style={styles.bottomBar}>
        <AppButton
          variant="primary"
          label={task.completed ? "Marked Complete" : "Mark as Complete"}
          icon={<Feather name="check" size={15} color="#fff" />}
          style={styles.completeBtn}
          onPress={() => {
            void toggleTaskComplete();
          }}
          labelStyle={styles.completeBtnText}
        />
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteTask}>
          <Feather name="trash-2" size={15} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef0f4" },
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  emptyText: { color: "#8a92a0", fontSize: 14 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingTop: 8, paddingBottom: 10 },
  headerIcon: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 14, fontWeight: "700", color: "#2f363f" },
  content: { paddingHorizontal: 12 },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 4 },
  tag: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, marginRight: 6 },
  tagText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  taskTitle: { fontSize: 39, lineHeight: 42, letterSpacing: -0.8, fontWeight: "600", color: "#373d45" },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  timeItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  timeText: { marginLeft: 5, fontSize: 12, color: "#8e96a5", fontWeight: "600" },
  sectionLabel: { marginTop: 18, marginBottom: 8, fontSize: 10, color: "#8a92a1", fontWeight: "800", letterSpacing: 1.1 },
  scopeText: { fontSize: 14, lineHeight: 22, color: "#505764" },
 
  subtasksWrap: { marginTop: 2 },
  subtaskRow: { backgroundColor: "#f7f8fb", borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 12, marginBottom: 8 },
  subtaskCheck: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.8, borderColor: "#aeb4c2", alignItems: "center", justifyContent: "center", marginRight: 9, backgroundColor: "#fff" },
  subtaskCheckActive: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
  subtaskText: { flex: 1, fontSize: 13, color: "#3e4652", lineHeight: 18 },
  addSubtaskBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  addSubtaskText: { color: "#6366f1", fontWeight: "700", fontSize: 13 },
  
  // TAMBAHAN: Styles untuk input subtask
  addSubtaskInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#d9dee8",
    marginTop: 4,
  },
  addSubtaskInput: {
    flex: 1,
    fontSize: 13,
    color: "#3e4652",
    paddingVertical: 6,
  },
  addSubtaskSaveBtn: {
    marginLeft: 8,
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addSubtaskSaveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
 
  avatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "#dde2e9" },
  avatarMore: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#7c70f7", borderWidth: 2, borderColor: "#dde2e9", alignItems: "center", justifyContent: "center" },
  avatarMoreText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#eef0f4", borderTopWidth: 1, borderColor: "#e3e7ee", paddingHorizontal: 12, paddingTop: 10, paddingBottom: 16, flexDirection: "row", alignItems: "center" },
  completeBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, marginRight: 8, shadowColor: "#6366f1", shadowOpacity: 0.28, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  completeBtnText: { fontSize: 13, fontWeight: "700" },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: "#d9dee8", alignItems: "center", justifyContent: "center", backgroundColor: "#f6f7fa" },
});