import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../components/ui/card";
import { ListItem } from "../components/ui/list-item";
import { PageHeader } from "../components/ui/page-header";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* HEADER SECTION */}
        <PageHeader
          superTitle="PERSONALIZE WORKSPACE"
          title="Settings"
          description="Refine your creative environment. Manage your identity, visual preferences, and localized experience within the digital atelier."
        />

        {/* AKUN CARD */}
        <Card>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={28} color="#1d4ed8" />
            <Text style={styles.cardTitle}>Akun</Text>
            <Text style={styles.cardSubtitle}>
              Manage your profile and subscription status
            </Text>
          </View>

          <ListItem
            icon="user"
            text="Informasi Profil"
            onPress={() => router.push("/editprofile")}
          />

          <ListItem
            icon="shield"
            text="Keamanan"
            onPress={() => router.push("/keamanan")}
          />
        </Card>

        {/* TAMPILAN CARD */}
        <Card>
          <View style={styles.cardHeader}>
            <Ionicons name="color-palette-outline" size={28} color="#1d4ed8" />
            <Text style={styles.cardTitle}>Tampilan</Text>
            <Text style={styles.cardSubtitle}>
              Customize themes and typography
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Buka Galeri Tema</Text>
            <Feather
              name="arrow-right"
              size={16}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>

          {/* Graphic Banner */}
          <View style={styles.themeBanner}>
            <Image
              // Menggunakan gambar placeholder abstrak yang mirip dengan desain
              source={{
                uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
              }}
              style={styles.themeImage}
            />
            {/* Widget Overlay */}
            <View style={styles.themeWidget}>
              <View style={styles.widgetLineBlue} />
              <View style={styles.widgetLineGray} />
            </View>
          </View>
        </Card>

        {/* BAHASA CARD */}
        <Card variant="outlined">
          <View style={styles.rowCardLeft}>
            <View style={styles.iconCircleBlue}>
              <Feather name="globe" size={18} color="#1d4ed8" />
            </View>
            <View>
              <Text style={styles.rowCardTitle}>Bahasa</Text>
              <Text style={styles.rowCardSubtitle}>Indonesia (ID)</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.actionTextBlue}>Ubah</Text>
          </TouchableOpacity>
        </Card>

        {/* TENTANG APLIKASI CARD */}
        <TouchableOpacity style={styles.filledCard} activeOpacity={0.7}>
          <View style={styles.rowCardLeft}>
            <View style={styles.iconCircleGray}>
              <Feather name="info" size={18} color="#4b5563" />
            </View>
            <View>
              <Text style={styles.rowCardTitle}>Tentang Aplikasi</Text>
              <Text style={styles.rowCardSubtitle}>
                v2.4.0 • Enterprise Edition
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>SmartNote</Text>
          <Text style={styles.footerSlogan}>
            DESIGNED FOR DIGITAL CRAFTSMEN
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa", // Background abu-abu muda sesuai desain
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },

  /* HEADER */
  header: {
    marginBottom: 32,
  },
  superTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1d4ed8",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#272f3a",
    letterSpacing: -1,
    marginBottom: 16,
  },
  pageDescription: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 24,
  },

  /* MAIN CARDS (Akun & Tampilan) */
  mainCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#272f3a",
    marginTop: 8,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f6f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2933",
    marginLeft: 12,
  },

  /* TAMPILAN KHUSUS */
  primaryButton: {
    backgroundColor: "#4f8cf6",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 30, // Pill shape
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  themeBanner: {
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  themeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  themeWidget: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 12,
  },
  widgetLineBlue: {
    width: 40,
    height: 6,
    backgroundColor: "#1d4ed8",
    borderRadius: 3,
    marginBottom: 6,
  },
  widgetLineGray: {
    width: 24,
    height: 6,
    backgroundColor: "#d1d5db",
    borderRadius: 3,
  },

  /* ROW CARDS (Bahasa & Tentang) */
  outlinedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fbfbfc",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  filledCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e6e8eb",
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  rowCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircleBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconCircleGray: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rowCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#272f3a",
    marginBottom: 2,
  },
  rowCardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  actionTextBlue: {
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: 14,
  },

  /* FOOTER */
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerBrand: {
    fontSize: 20,
    fontWeight: "800",
    color: "#b8bcc5",
    marginBottom: 4,
  },
  footerSlogan: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: "row",
    gap: 20,
  },
  footerLinkText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
});
