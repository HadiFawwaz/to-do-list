import { AppButton } from "@/components/ui/app-button";
import { AppHeader } from "@/components/ui/app-header";
import { SectionHeader } from "@/components/ui/section-header";
import { TaskCard } from "@/components/ui/task-card";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
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
const WEEKDAY_SHORT = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;
const INTENSITY_OPTIONS = [
  "High Priority",
  "Steady Pace",
  "Low Focus",
] as const;

type IntensityOption = (typeof INTENSITY_OPTIONS)[number];

// TAMBAHAN: Definisikan tipe subtask agar tidak hilang
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
  date: string;
  intensity: IntensityOption;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks: TodoSubtask[]; // TAMBAHAN
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

const formatShortDateLabel = (isoDate: string) => {
  const date = parseISODate(isoDate);
  if (!date) return "Today";
  if (isoDate === toISODate(new Date())) return "Today";
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
};

const formatDueBadge = (isoDate: string, todayISO: string) => {
  if (isoDate === todayISO) return "TODAY";
  const date = parseISODate(isoDate);
  if (!date) return "UPCOMING";
  const today = parseISODate(todayISO);
  if (!today) return "UPCOMING";
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 1) return "TOMORROW";
  return `${WEEKDAY_SHORT[date.getDay()]}, ${date.getDate()}`;
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
  const completed =
    typeof record.completed === "boolean" ? record.completed : false;
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

  // TAMBAHAN: Jangan hapus subtasks dari storage
  const subtasks = Array.isArray(record.subtasks)
    ? (record.subtasks as TodoSubtask[])
    : [];

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
    subtasks,
  };
};

const intensityBadgeMap: Record<
  IntensityOption,
  { text: string; backgroundColor: string; textColor: string }
> = {
  "High Priority": {
    text: "HIGH PRIORITY",
    backgroundColor: "#f7e7f8",
    textColor: "#b532c4",
  },
  "Steady Pace": {
    text: "STEADY PACE",
    backgroundColor: "#ebeefe",
    textColor: "#585ce5",
  },
  "Low Focus": {
    text: "LOW FOCUS",
    backgroundColor: "#e9edf4",
    textColor: "#6f7786",
  },
};

export default function TasksScreen() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    "https://i.pravatar.cc/100?img=11",
  );
  const [userName, setUserName] = useState("User");

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (!saved) {
            setTodos([]);
            return;
          }

          const parsed: unknown = JSON.parse(saved);
          const list = Array.isArray(parsed) ? parsed : [];
          const normalized = list.map(normalizeStoredTodo);
          setTodos(normalized);

          const normalizedSerialized = JSON.stringify(normalized);
          const parsedSerialized = JSON.stringify(list);
          if (normalizedSerialized !== parsedSerialized) {
            await AsyncStorage.setItem(STORAGE_KEY, normalizedSerialized);
          }

          const savedProfile = await AsyncStorage.getItem("userProfile");
          if (savedProfile) {
            try {
              const profile = JSON.parse(savedProfile);
              if (profile.avatar) setAvatarUri(profile.avatar);
              if (profile.name) setUserName(profile.name);
            } catch (error) {
              console.error("Failed to parse profile:", error);
            }
          }
        } catch (error) {
          console.log(error);
          setTodos([]);
        }
      };

      void loadData();
    }, []),
  );

  const persistTodos = async (nextTodos: TodoItem[]) => {
    try {
      setTodos(nextTodos);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
    } catch (error) {
      setTodos(todos);
      Alert.alert("Error", "Gagal menyimpan perubahan. Silakan coba lagi.", [
        { text: "OK", style: "default" },
      ]);
      console.error("Failed to persist todos:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const updated = todos.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task,
      );
      await persistTodos(updated);
    } catch (error) {
      Alert.alert("Error", "Gagal mengubah status task.", [
        { text: "OK", style: "default" },
      ]);
      console.error("Failed to toggle complete:", error);
    }
  };

  const confirmDeleteTask = (id: string) => {
    Alert.alert(
      "Hapus Task?",
      "Task ini akan dihapus permanen dan tidak dapat dikembalikan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = todos.filter((task) => task.id !== id);
              await persistTodos(updated);
              Alert.alert("Berhasil", "Task berhasil dihapus.", [
                { text: "OK", style: "default" },
              ]);
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus task. Silakan coba lagi.", [
                { text: "OK", style: "default" },
              ]);
              console.error("Failed to delete task:", error);
            }
          },
        },
      ],
    );
  };

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      const byDate = a.dueDate.localeCompare(b.dueDate);
      if (byDate !== 0) return byDate;
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [todos]);

  const todayISO = toISODate(new Date());

  const todayTodos = useMemo(
    () => sortedTodos.filter((task) => task.dueDate === todayISO),
    [sortedTodos, todayISO],
  );
  const actionableTodayTodos = useMemo(
    () =>
      sortedTodos.filter((task) => !task.completed && task.dueDate <= todayISO),
    [sortedTodos, todayISO],
  );
  const upcomingTodos = useMemo(
    () =>
      sortedTodos.filter((task) => !task.completed && task.dueDate > todayISO),
    [sortedTodos, todayISO],
  );
  const historyTodos = useMemo(
    () =>
      [...sortedTodos]
        .filter((task) => task.completed)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [sortedTodos],
  );

  const completedCount = todayTodos.filter((task) => task.completed).length;
  const progressPercent =
    todayTodos.length > 0
      ? Math.round((completedCount / todayTodos.length) * 100)
      : 0;

  const visibleUpcomingTodos = showAllUpcoming
    ? upcomingTodos
    : upcomingTodos.slice(0, 4);

  const firstUpcoming = visibleUpcomingTodos[0];
  const secondUpcoming = visibleUpcomingTodos[1];
  const restUpcoming = visibleUpcomingTodos.slice(2);

  const visibleHistoryTodos = showAllHistory
    ? historyTodos
    : historyTodos.slice(0, 4);

  const openDetail = (id: string) => {
    router.push({ pathname: "/detail", params: { id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        avatarUri={avatarUri}
        title={userName}
        onSettingsPress={() => router.push("/setting")}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.headerWrap}>
          <Text style={styles.headerSubtitle}>DAILY MOMENTUM</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerPercentage}>{progressPercent}%</Text>
            <View style={styles.headerMetaWrap}>
              <Text style={styles.headerFocus}>Focusing</Text>
              <Text style={styles.headerTaskCount}>
                {completedCount} of {todayTodos.length} tasks done
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <SectionHeader title="Today" count={actionableTodayTodos.length} />

          {actionableTodayTodos.length === 0 ? (
            <Text style={styles.emptyText}>No active tasks for today.</Text>
          ) : (
            actionableTodayTodos.map((item) => {
              const isOverdue = item.dueDate < todayISO;
              return (
                <TaskCard
                  key={item.id}
                  variant="today"
                  title={item.title}
                  badge={
                    isOverdue
                      ? "OVERDUE"
                      : intensityBadgeMap[item.intensity].text
                  }
                  badgeType={
                    isOverdue
                      ? "overdue"
                      : (item.intensity.toLowerCase().replace(" ", "-") as any)
                  }
                  isCompleted={item.completed}
                  isOverdue={isOverdue}
                  meta={
                    isOverdue
                      ? `Due ${formatShortDateLabel(item.dueDate)}`
                      : formatShortDateLabel(item.dueDate)
                  }
                  onPress={() => openDetail(item.id)}
                  onLongPress={() => confirmDeleteTask(item.id)}
                  onCheckPress={() => {
                    void toggleComplete(item.id);
                  }}
                />
              );
            })
          )}
        </View>

        <View style={styles.sectionWrap}>
          <SectionHeader
            title="Upcoming"
            showSeeAll={upcomingTodos.length > 2}
            collapsed={showAllUpcoming}
            disableSeeAll={upcomingTodos.length <= 2}
            onSeeAllPress={() => setShowAllUpcoming((prev) => !prev)}
          />

          <TouchableOpacity
            style={styles.upcomingBigCard}
            activeOpacity={0.92}
            onPress={() => {
              if (firstUpcoming) openDetail(firstUpcoming.id);
            }}
            onLongPress={() => {
              if (firstUpcoming) confirmDeleteTask(firstUpcoming.id);
            }}>
            <View style={styles.upcomingBigHeader}>
              <Text style={styles.upcomingBadgeText}>
                {firstUpcoming
                  ? formatDueBadge(firstUpcoming.dueDate, todayISO)
                  : "TOMORROW"}
              </Text>
              <Feather name="calendar" size={17} color="#7177f8" />
            </View>
            <Text style={styles.upcomingBigTitle}>
              {firstUpcoming
                ? firstUpcoming.title
                : "Client Presentation: Kinetic Project"}
            </Text>
            <Text style={styles.upcomingBigDesc}>
              {firstUpcoming?.desc || "Check wireframes & slide deck content."}
            </Text>
          </TouchableOpacity>

          <View style={styles.upcomingBottomRow}>
            <TouchableOpacity
              style={styles.upcomingSmallCard}
              activeOpacity={0.92}
              onPress={() => {
                if (secondUpcoming) openDetail(secondUpcoming.id);
              }}
              onLongPress={() => {
                if (secondUpcoming) confirmDeleteTask(secondUpcoming.id);
              }}>
              <Text style={styles.upcomingBadgeText}>
                {secondUpcoming
                  ? formatDueBadge(secondUpcoming.dueDate, todayISO)
                  : "WED, 14"}
              </Text>
              <Text style={styles.upcomingSmallTitle}>
                {secondUpcoming ? secondUpcoming.title : "Dentist Appt."}
              </Text>
              <Text style={styles.upcomingSmallDesc}>
                {secondUpcoming
                  ? formatShortDateLabel(secondUpcoming.dueDate)
                  : "09:00 AM"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scheduleCard}
              activeOpacity={0.9}
              onPress={() => router.push("/addtodo")}>
              <Feather name="plus-circle" size={23} color="#9aa0ae" />
              <Text style={styles.scheduleText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          {restUpcoming.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {restUpcoming.map((item) => (
                <TaskCard
                  key={item.id}
                  variant="rest-upcoming"
                  title={item.title}
                  badge={formatDueBadge(item.dueDate, todayISO)}
                  onPress={() => openDetail(item.id)}
                  onLongPress={() => confirmDeleteTask(item.id)}
                />
              ))}
            </View>
          )}
        </View>

        {historyTodos.length > 0 && (
          <View style={styles.sectionWrap}>
            <SectionHeader
              title="History"
              showSeeAll={historyTodos.length > 4}
              collapsed={showAllHistory}
              disableSeeAll={historyTodos.length <= 4}
              onSeeAllPress={() => setShowAllHistory((prev) => !prev)}
            />

            {visibleHistoryTodos.map((item) => (
              <TaskCard
                key={item.id}
                variant="history"
                title={item.title}
                meta={`Completed - ${formatShortDateLabel(item.dueDate)}`}
                onPress={() => openDetail(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <AppButton
        variant="fab"
        style={styles.fab}
        icon={<Feather name="plus" size={28} color="#fff" />}
        onPress={() => router.push("/addtodo")}
        activeOpacity={0.9}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eceef2" },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 170 },
  headerWrap: { marginBottom: 26 },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8c92a0",
    letterSpacing: 1.3,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  headerPercentage: {
    fontSize: 55,
    fontWeight: "900",
    color: "#2f343d",
    letterSpacing: -2,
    lineHeight: 60,
  },
  headerMetaWrap: { marginLeft: 10 },
  headerFocus: { fontSize: 16, fontWeight: "700", color: "#5d66e8" },
  headerTaskCount: { fontSize: 13, color: "#7e8594", marginTop: 2 },
  sectionWrap: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#323840",
    letterSpacing: -0.3,
  },
  badgeCount: {
    backgroundColor: "#dde2ea",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6a7380",
    letterSpacing: 0.6,
  },
  seeAllText: { fontSize: 14, fontWeight: "700", color: "#666ff0" },
  seeAllDisabled: { color: "#c5cbda" },
  emptyText: {
    textAlign: "center",
    color: "#9098a7",
    marginVertical: 18,
    fontSize: 14,
  },
  todayCard: {
    backgroundColor: "#f7f8fb",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
  },
  todayCheckBtn: { paddingTop: 12, marginRight: 12 },
  priorityBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginBottom: 8,
  },
  priorityBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.4 },
  overdueBadge: { backgroundColor: "#ffe3e3" },
  overdueBadgeText: { color: "#d83333" },
  todayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3a3f47",
    lineHeight: 22,
  },
  todayMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  todayMetaText: { fontSize: 12, color: "#8f96a4" },
  upcomingBigCard: {
    backgroundColor: "#e9edf3",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  upcomingBigHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  upcomingBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7d8594",
    letterSpacing: 0.8,
  },
  upcomingBigTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#343b44",
    lineHeight: 24,
  },
  upcomingBigDesc: {
    fontSize: 13,
    color: "#7f8695",
    marginTop: 8,
    lineHeight: 18,
  },
  upcomingBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },
  upcomingSmallCard: {
    flex: 1,
    backgroundColor: "#f7f8fb",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 7,
  },
  upcomingSmallTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#343b44",
    marginTop: 8,
    lineHeight: 20,
  },
  upcomingSmallDesc: { fontSize: 12, color: "#8a919f", marginTop: 8 },
  scheduleCard: {
    flex: 1,
    marginLeft: 7,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#d7dbe4",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f5f8",
  },
  scheduleText: {
    marginTop: 8,
    fontSize: 13,
    color: "#808897",
    fontWeight: "600",
  },
  restUpcomingCard: {
    backgroundColor: "#f7f8fb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restUpcomingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3d4450",
    flex: 1,
  },
  restUpcomingMeta: { fontSize: 11, fontWeight: "700", color: "#7e8695" },
  historyCard: {
    backgroundColor: "#f7f8fb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  historyTitle: { fontSize: 14, fontWeight: "600", color: "#3d4450" },
  historyMeta: { fontSize: 12, color: "#7d8594", marginTop: 4 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#d1d5db",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3138",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 104,
    shadowColor: "#6366f1",
    shadowOpacity: 0.34,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
});
