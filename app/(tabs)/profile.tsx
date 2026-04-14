import { MenuItem } from "@/components/ui/menu-item";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@kinetic.flow");
  const [avatarUri, setAvatarUri] = useState(
    "https://i.pravatar.cc/300?img=11",
  );
  const [headerName, setHeaderName] = useState("User");

  // Load data profile setiap kali halaman ini dibuka
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const savedProfile = await AsyncStorage.getItem("userProfile");
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.name) {
              setName(parsed.name);
              setHeaderName(parsed.name);
            }
            if (parsed.email) setEmail(parsed.email);
            if (parsed.avatar) setAvatarUri(parsed.avatar);
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      };
      void loadProfile();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.7}>
            <Feather
              name="arrow-left"
              size={24}
              color="#1f2933"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Saya</Text>
          <View style={styles.headerRight}>
            <Text style={styles.brandName}>Kinetic Flow</Text>
          </View>
        </View>

        {/* PROFILE CARD SECTION */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            {/* Langsung ke halaman edit profile saat avatar diklik */}
            <TouchableOpacity
              onPress={() => router.push("/editprofile")}
              style={styles.editAvatarBtn}>
              <Feather name="edit-2" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>

          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM MEMBER</Text>
          </View>
        </View>

        {/* MENU GROUPS */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupLabel}>AKUN & PREFERENSI</Text>
          <View style={styles.groupCard}>
            <MenuItem
              icon="user"
              label="Edit Profil"
              color="#eff6ff"
              iconColor="#2563eb"
              // Arahkan ke halaman editprofile
              onPress={() => router.push("/editprofile")}
            />
            <MenuItem
              icon="shield"
              label="Keamanan"
              color="#f0fdf4"
              iconColor="#16a34a"
              onPress={() => router.push("/keamanan")}
            />
            <MenuItem
              icon="bell"
              label="Notifikasi"
              color="#fff7ed"
              iconColor="#ea580c"
              last
            />
          </View>
        </View>

        {/* TEMA SWITCH */}
        <View style={styles.menuGroup}>
          <View style={styles.themeCard}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#eff6ff" }]}>
                <Feather name="moon" size={20} color="#2563eb" />
              </View>
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.menuLabel}>Tema (Gelap/Terang)</Text>
                <Text style={styles.menuSubLabel}>
                  Mode {isDarkMode ? "Gelap" : "Terang"} Aktif
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e2e8f0", true: "#2563eb" }}
              thumbColor={"#fff"}
              onValueChange={() => setIsDarkMode(!isDarkMode)}
              value={isDarkMode}
            />
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Kinetic Flow</Text>
          <Text style={styles.footerVersion}>VERSION 2.4.0 (2026)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#2563eb" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  brandName: { fontSize: 20, fontWeight: "800", color: "#1f2933" },
  profileSection: { alignItems: "center", marginTop: 20, marginBottom: 30 },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    borderColor: "#fff",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#f8fafc",
    zIndex: 1,
  },
  userName: { fontSize: 28, fontWeight: "800", color: "#1f2933" },
  userEmail: { fontSize: 15, color: "#64748b", marginTop: 4 },
  premiumBadge: {
    backgroundColor: "#dbeafe",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 15,
  },
  premiumText: {
    color: "#2563eb",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  menuGroup: { paddingHorizontal: 24, marginBottom: 20 },
  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 10,
  },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  themeCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2933",
    marginLeft: 16,
  },
  menuSubLabel: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  logoutButton: {
    marginHorizontal: 24,
    backgroundColor: "#fee2e2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 24,
    marginTop: 10,
    gap: 12,
  },
  logoutText: { color: "#dc2626", fontWeight: "700", fontSize: 16 },
  footer: { alignItems: "center", marginTop: 40, paddingBottom: 60 },
  footerBrand: { fontSize: 22, fontWeight: "800", color: "#cbd5e1" },
  footerVersion: {
    fontSize: 11,
    color: "#cbd5e1",
    marginTop: 6,
    letterSpacing: 1.5,
  },
});
