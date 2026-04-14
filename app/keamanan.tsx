import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionButton } from "../components/ui/action-button";
import { Card } from "../components/ui/card";
import { PageHeader } from "../components/ui/page-header";
import { StatusBadge } from "../components/ui/status-badge";

export default function SecurityScreen() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <PageHeader
          title={`Pusat${"\n"}Keamanan`}
          description="Lindungi catatan dan ide kreatif Anda dengan protokol keamanan tingkat lanjut."
        />

        {/* UBAH KATA SANDI CARD */}
        <Card>
          <View style={styles.iconCircleBlue}>
            <Feather name="key" size={16} color="#2563eb" />
          </View>
          <Text style={styles.cardTitle}>Ubah Kata Sandi</Text>
          <Text style={styles.cardDescription}>
            Terakhir diperbarui 3 bulan yang lalu. Gunakan kombinasi simbol dan
            angka untuk keamanan maksimal.
          </Text>
          <ActionButton
            text="Perbarui Sekarang"
            variant="blue"
            icon="chevron-right"
          />
        </Card>

        {/* 2FA CARD */}
        <Card>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleBlue}>
              <Feather name="shield" size={16} color="#2563eb" />
            </View>
            <Switch
              trackColor={{ false: "#e2e8f0", true: "#2563eb" }}
              thumbColor="#fff"
              onValueChange={() => setIs2FAEnabled(!is2FAEnabled)}
              value={is2FAEnabled}
            />
          </View>
          <Text style={styles.cardTitle}>Otentikasi Dua Faktor (2FA)</Text>
          <Text style={styles.cardDescription}>
            Tambahkan lapisan keamanan ekstra pada akun Anda dengan kode
            verifikasi dari perangkat seluler.
          </Text>
          {is2FAEnabled && (
            <StatusBadge
              text="AKTIF: GOOGLE AUTHENTICATOR"
              variant="gray"
              icon="check-circle"
            />
          )}
        </Card>

        {/* PERANGKAT TERHUBUNG CARD */}
        <Card>
          <View style={styles.deviceHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Perangkat{"\n"}Terhubung</Text>
              <Text style={styles.cardDescription}>
                Kelola perangkat yang memiliki akses ke akun SmartNote Anda.
              </Text>
            </View>
            <ActionButton
              text={`Keluar${"\n"}dari${"\n"}Semua${"\n"}Sesi`}
              variant="red"
            />
          </View>

          {/* Device 1 */}
          <View style={styles.deviceRow}>
            <View style={styles.deviceIconWrapper}>
              <Feather name="monitor" size={20} color="#475569" />
            </View>
            <View style={styles.deviceInfo}>
              <View style={styles.deviceNameRow}>
                <Text style={styles.deviceName}>MacBook Pro 14"</Text>
                <StatusBadge text="SESI INI" variant="blue-light" />
              </View>
              <Text style={styles.deviceMeta}>
                Jakarta, Indonesia • Safari di macOS Sonoma
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutIconBtn}>
              <Feather name="log-out" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Device 2 */}
          <View style={styles.deviceRow}>
            <View style={styles.deviceIconWrapper}>
              <Feather name="smartphone" size={20} color="#475569" />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>iPhone 15 Pro</Text>
              <Text style={styles.deviceMeta}>
                Bandung, Indonesia • SmartNote App v2.4.1
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutIconBtn}>
              <Feather name="log-out" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Device 3 */}
          <View
            style={[
              styles.deviceRow,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}>
            <View style={styles.deviceIconWrapper}>
              <Feather name="tablet" size={20} color="#475569" />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>iPad Pro 12.9"</Text>
              <Text style={styles.deviceMeta}>
                Jakarta, Indonesia • SmartNote App v2.4.1
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutIconBtn}>
              <Feather name="log-out" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* SETTINGS LIST (GRAY CARDS) */}
        <Card variant="gray">
          <Feather
            name="clock"
            size={18}
            color="#475569"
            style={styles.grayCardIcon}
          />
          <Text style={styles.grayCardTitle}>Log Aktivitas</Text>
          <Text style={styles.grayCardDescription}>
            Lihat riwayat login dan perubahan keamanan akun Anda.
          </Text>
          <ActionButton text="LIHAT LOG" variant="blue" />
        </Card>

        <Card variant="gray">
          <Feather
            name="lock"
            size={18}
            color="#475569"
            style={styles.grayCardIcon}
          />
          <Text style={styles.grayCardTitle}>Enkripsi Data</Text>
          <Text style={styles.grayCardDescription}>
            Aktifkan enkripsi end-to-end untuk catatan sensitif Anda.
          </Text>
          <ActionButton text="KONFIGURASI" variant="blue" />
        </Card>

        <Card variant="gray">
          <Feather
            name="mail"
            size={18}
            color="#475569"
            style={styles.grayCardIcon}
          />
          <Text style={styles.grayCardTitle}>Notifikasi Login</Text>
          <Text style={styles.grayCardDescription}>
            Dapatkan peringatan instan jika ada akses mencurigakan.
          </Text>
          <ActionButton text="ATUR NOTIFIKASI" variant="blue" />
        </Card>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Butuh Bantuan?</Text>
          <Text style={styles.footerDescription}>
            Hubungi tim dukungan kami jika Anda menemukan aktivitas yang tidak
            sah.
          </Text>
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.btnGray} activeOpacity={0.8}>
              <Text style={styles.btnGrayText}>Pusat{"\n"}Bantuan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnBlue} activeOpacity={0.8}>
              <Text style={styles.btnBlueText}>Kontak{"\n"}Support</Text>
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
    backgroundColor: "#f5f7f9", // Background abu-abu muda
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },

  /* HEADER */
  header: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 12,
  },
  pageDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    paddingRight: 40,
  },

  /* WHITE CARDS */
  whiteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionTextBlue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563eb",
  },
  badgeGray: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badgeGrayText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.5,
  },

  /* DEVICE LIST */
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  actionTextRed: {
    fontSize: 12,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "right",
    lineHeight: 18,
    marginLeft: 16,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  deviceIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginRight: 8,
  },
  badgeBlueLight: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeBlueLightText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: 0.5,
  },
  deviceMeta: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 16,
  },
  logoutIconBtn: {
    padding: 8,
  },

  /* GRAY CARDS (List Options) */
  grayCard: {
    backgroundColor: "#eef2f6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  grayCardIcon: {
    marginBottom: 12,
  },
  grayCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  grayCardDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 16,
  },
  grayCardAction: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: 0.5,
  },

  /* FOOTER */
  footer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 16,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  btnGray: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  btnGrayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
  },
  btnBlue: {
    backgroundColor: "#0056d2", // Biru pekat sesuai gambar
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  btnBlueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
});
