import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const [name, setName] = useState("Alex Rivers");
  const [email, setEmail] = useState("alex.rivers@atelier.digital");
  const [bio, setBio] = useState(
    "Digital Curator & Minimalist Architect. Crafting experiences that breathe in the Digital Atelier. Notes are the seeds of tomorrow's structures.",
  );
  // Default foto profil
  const [avatarUri, setAvatarUri] = useState(
    "https://i.pravatar.cc/300?img=11",
  );

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const savedProfile = await AsyncStorage.getItem("userProfile");
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.name) setName(parsed.name);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.bio) setBio(parsed.bio);
            if (parsed.avatar) setAvatarUri(parsed.avatar); // Load foto
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      };
      void loadProfile();
    }, []),
  );

  // Fungsi untuk membuka galeri dan memilih foto
  const pickImage = async () => {
    try {
      // Meminta izin akses galeri
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Kami membutuhkan izin akses galeri untuk mengubah foto profil.",
          [{ text: "OK", style: "default" }],
        );
        return;
      }

      // Membuka galeri
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal membuka galeri foto. Silakan coba lagi.", [
        { text: "OK", style: "default" },
      ]);
      console.error("Error picking image:", error);
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    // Validasi input
    if (!name.trim()) {
      Alert.alert("Validasi Gagal", "Nama tidak boleh kosong.", [
        { text: "OK", style: "default" },
      ]);
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validasi Gagal", "Email tidak boleh kosong.", [
        { text: "OK", style: "default" },
      ]);
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validasi Gagal", "Format email tidak valid.", [
        { text: "OK", style: "default" },
      ]);
      return;
    }

    // Konfirmasi sebelum simpan
    Alert.alert(
      "Konfirmasi Simpan",
      "Apakah Anda yakin ingin menyimpan perubahan profil?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Simpan",
          style: "default",
          onPress: async () => {
            try {
              const profileData = { name, email, bio, avatar: avatarUri };
              await AsyncStorage.setItem(
                "userProfile",
                JSON.stringify(profileData),
              );
              Alert.alert("Berhasil", "Profil berhasil disimpan!", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert(
                "Error Penyimpanan",
                "Gagal menyimpan profil. Silakan coba lagi.",
                [{ text: "OK", style: "default" }],
              );
              console.error("Failed to save profile:", error);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              {/* HEADER */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Discard Changes?",
                        "Perubahan yang belum disimpan akan hilang.",
                        [
                          { text: "Lanjutkan Edit", style: "cancel" },
                          {
                            text: "Discard",
                            style: "destructive",
                            onPress: () => router.back(),
                          },
                        ],
                      );
                    }}
                    activeOpacity={0.7}
                    style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color="#1f2933" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Edit Profile</Text>
                </View>
                <Image source={{ uri: avatarUri }} style={styles.smallAvatar} />
              </View>

              {/* AVATAR SECTION */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.largeAvatar}
                  />

                  {/* Tombol Kamera diaktifkan */}
                  <TouchableOpacity
                    style={styles.cameraBtn}
                    activeOpacity={0.8}
                    onPress={pickImage}>
                    <Feather name="camera" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.memberText}>MEMBER SINCE 2023</Text>
                <Text style={styles.resolutionText}>
                  Recommended: 1000 x 1000px
                </Text>
              </View>

              {/* FORM FIELDS */}
              <View style={styles.formContainer}>
                <Text style={[styles.label, { color: "#2563eb" }]}>
                  NAMA LENGKAP
                </Text>
                <TextInput
                  style={styles.inputWhite}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.inputWhite}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>BIO</Text>
                <TextInput
                  style={styles.inputGray}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* WIDGET CARDS (Tetap) */}
              <View style={styles.rowCards}>
                <View style={styles.widgetCard}>
                  <Text style={styles.widgetLabel}>LOCATION</Text>
                  <View style={styles.widgetInner}>
                    <Text style={styles.widgetValue}>Copenhagen,{"\n"}DK</Text>
                    <Feather name="globe" size={18} color="#9ca3af" />
                  </View>
                </View>
                <View style={styles.widgetCard}>
                  <Text style={styles.widgetLabel}>THEME</Text>
                  <View style={styles.widgetInner}>
                    <Text style={styles.widgetValue}>Azure Light</Text>
                    <Feather name="aperture" size={18} color="#9ca3af" />
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* BOTTOM BAR (Tetap) */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.discardBtn}
                onPress={() => {
                  Alert.alert(
                    "Discard Changes?",
                    "Perubahan yang belum disimpan akan hilang.",
                    [
                      { text: "Lanjutkan Edit", style: "cancel" },
                      {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => router.back(),
                      },
                    ],
                  );
                }}>
                <Text style={styles.discardText}>Discard{"\n"}Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Feather
                  name="check-circle"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveText}>Save{"\n"}Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f6f9" },
  scrollContent: { paddingBottom: 120 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#272f3a" },
  smallAvatar: { width: 36, height: 36, borderRadius: 18 },
  avatarSection: { alignItems: "center", marginTop: 32, marginBottom: 24 },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  largeAvatar: { width: 140, height: 140, borderRadius: 36 },
  cameraBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#1d4ed8",
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 4,
    borderColor: "#f4f6f9",
    justifyContent: "center",
    alignItems: "center",
  },
  memberText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6b7280",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  resolutionText: { fontSize: 10, color: "#9ca3af" },
  formContainer: { paddingHorizontal: 24 },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 16,
  },
  inputWhite: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2c3138",
    fontWeight: "600",
  },
  inputGray: {
    backgroundColor: "#eef2f6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    minHeight: 120,
  },
  rowCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 24,
  },
  widgetCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
  },
  widgetLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#9ca3af",
    letterSpacing: 1,
    marginBottom: 8,
  },
  widgetInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  widgetValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2933",
    lineHeight: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    paddingTop: 16,
    backgroundColor: "rgba(244, 246, 249, 0.95)",
  },
  discardBtn: { marginRight: 24 },
  discardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "right",
  },
  saveBtn: {
    backgroundColor: "#4f8cf6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#4f8cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  saveText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "left",
  },
});
