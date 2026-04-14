import { AppHeader } from "@/components/ui/app-header";
import { TaskCard } from "@/components/ui/task-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "todo";

type TodoItem = {
  id: string;
  title: string;
  intensity: string;
  completed: boolean;
  dueDate: string; // Format: YYYY-MM-DD
  updatedAt: string;
};

export default function ArchiveScreen() {
  const [groups, setGroups] = useState<
    { label: string; dateFull: string; tasks: TodoItem[] }[]
  >([]);
  const [totalFinished, setTotalFinished] = useState(0);
  const [avatarUri, setAvatarUri] = useState(
    "https://i.pravatar.cc/100?img=11",
  );
  const [userName, setUserName] = useState("User");

  // Fungsi untuk memformat label (Today, Yesterday, atau Tanggal Spesifik)
  const getGroupInfo = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const taskDate = new Date(dateStr);

    // Format pencocokan YYYY-MM-DD
    const toDateKey = (d: Date) => d.toISOString().split("T")[0];
    const todayKey = toDateKey(today);
    const yesterdayKey = toDateKey(yesterday);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    if (dateStr === todayKey) {
      return {
        label: "Today",
        full: today.toLocaleDateString("en-US", options),
      };
    } else if (dateStr === yesterdayKey) {
      return {
        label: "Yesterday",
        full: yesterday.toLocaleDateString("en-US", options),
      };
    } else {
      return {
        label: taskDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
        full: taskDate.toLocaleDateString("en-US", options),
      };
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (saved) {
            const allTodos: TodoItem[] = JSON.parse(saved);
            const finished = allTodos.filter((t) => t.completed);
            setTotalFinished(finished.length);

            // LOGIKA PENGELOMPOKKAN
            const groupedMap: { [key: string]: TodoItem[] } = {};

            finished.forEach((task) => {
              // Kita kelompokkan berdasarkan tanggal update (kapan dia diselesaikan)
              // atau bisa pakai dueDate. Di sini kita pakai dueDate agar rapi.
              const dateKey = task.dueDate;
              if (!groupedMap[dateKey]) groupedMap[dateKey] = [];
              groupedMap[dateKey].push(task);
            });

            // Ubah Map menjadi Array dan urutkan tanggal terbaru di atas
            const sortedGroups = Object.keys(groupedMap)
              .sort((a, b) => b.localeCompare(a))
              .map((dateKey) => {
                const info = getGroupInfo(dateKey);
                return {
                  label: info.label,
                  dateFull: info.full,
                  tasks: groupedMap[dateKey],
                };
              });

            setGroups(sortedGroups);
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
        } catch (e) {
          console.error(e);
        }
      };
      loadData();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        avatarUri={avatarUri}
        title={userName}
        onSettingsPress={() => router.push("/setting")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.subtitle}>TASK HISTORY</Text>
          <Text style={styles.mainTitle}>Completed</Text>
          <View style={styles.statsRow}>
            <View style={styles.statsLine} />
            <Text style={styles.statsText}>{totalFinished} Tasks Finished</Text>
          </View>
        </View>

        {groups.map((group, idx) => (
          <View key={idx} style={styles.groupSection}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.label}</Text>
              <Text style={styles.groupDate}>{group.dateFull}</Text>
            </View>

            {group.tasks.map((task) => (
              <TaskCard
                key={task.id}
                variant="archive"
                title={task.title}
                badge={
                  task.intensity === "High Priority"
                    ? "HIGH PRIORITY"
                    : undefined
                }
                meta={
                  task.intensity === "High Priority"
                    ? undefined
                    : task.intensity.toUpperCase()
                }
              />
            ))}
          </View>
        ))}

        {/* Efficiency Report tetap statis sebagai pemanis UI */}
        <View style={styles.efficiencyCard}>
          <Text style={styles.efficiencyLabel}>EFFICIENCY REPORT</Text>
          <Text style={styles.efficiencyTitle}>
            You're 15% more{"\n"}productive than{"\n"}last week.
          </Text>
          <View style={styles.efficiencyStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>STREAK</Text>
              <Text style={styles.statBoxValue}>12</Text>
              <Text style={styles.statBoxUnit}>Days</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>VELOCITY</Text>
              <Text style={styles.statBoxValue}>4.2</Text>
              <Text style={styles.statBoxUnit}>Tasks/{"\n"}Day</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#d1d5db",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#2c3138" },
  titleSection: { marginBottom: 32 },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6c6df8",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: "400",
    color: "#2b3038",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statsLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e5ea",
    marginRight: 12,
  },
  statsText: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  groupSection: { marginBottom: 28 },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  groupTitle: { fontSize: 18, fontWeight: "700", color: "#2e333b" },
  groupDate: { fontSize: 12, color: "#9ca3af", fontWeight: "500" },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#524ee6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  taskInfo: { flex: 1 },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#616874",
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fce7f3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  priorityText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#db2777",
    letterSpacing: 0.5,
  },
  efficiencyCard: {
    backgroundColor: "#544be6",
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
  },
  efficiencyLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a4a1f6",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  efficiencyTitle: {
    fontSize: 26,
    fontWeight: "400",
    color: "#ffffff",
    lineHeight: 34,
    marginBottom: 24,
  },
  efficiencyStatsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: {
    flex: 1,
    backgroundColor: "#6861e9",
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#b9b6f8",
    letterSpacing: 1,
    marginBottom: 8,
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 2,
  },
  statBoxUnit: { fontSize: 14, fontWeight: "600", color: "#ffffff" },
});
