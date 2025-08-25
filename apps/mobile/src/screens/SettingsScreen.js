// screens/SettingsScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function SettingsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState("testuser");
  const [email, setEmail] = useState("testuser@mail.com");
  const [password, setPassword] = useState("123456");
  const [phone, setPhone] = useState("05555555555");

  const handleSave = () => {
    Alert.alert(
      "Bilgiler güncellendi ✅",
      `Kullanıcı: ${username}\nE-mail: ${email}\nTelefon: ${phone}`
    );
  };

  const handleLogout = () => {
    Alert.alert("Çıkış Yapıldı 👋");
    navigation.replace("Login");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Üst kısım: settings ikonu solda, yanında Ayarlar yazısı */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/icons/settings.png")}
            style={{ width: 26, height: 26, resizeMode: "contain", marginRight: 8 }}
          />
          <Text style={[styles.title, { color: theme.colors.text }]}>Ayarlar</Text>
        </View>
      </View>

      {/* Kullanıcı adı */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.primary, color: theme.colors.text },
        ]}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı adı"
        placeholderTextColor={theme.colors.border}
      />

      {/* E-mail */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.primary, color: theme.colors.text },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        placeholderTextColor={theme.colors.border}
        keyboardType="email-address"
      />

      {/* Şifre */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.primary, color: theme.colors.text },
        ]}
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        placeholderTextColor={theme.colors.border}
        secureTextEntry
      />

      {/* Telefon */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.primary, color: theme.colors.text },
        ]}
        value={phone}
        onChangeText={setPhone}
        placeholder="Telefon numarası"
        placeholderTextColor={theme.colors.border}
        keyboardType="phone-pad"
      />

      {/* Kaydet */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Kaydet</Text>
      </TouchableOpacity>

      {/* Çıkış */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutButton: {
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
