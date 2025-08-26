// screens/ResetPasswordScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function ResetPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    // ✅ Burada backend'e şifre resetleme isteği yapılmalı
    Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi.");
    navigation.replace("Login"); // Login ekranına yönlendir
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Yeni Şifre Belirle</Text>

      {/* Yeni şifre */}
      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Yeni Şifre"
        placeholderTextColor={theme.colors.border}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Yeni şifre tekrar */}
      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Yeni Şifre Tekrar"
        placeholderTextColor={theme.colors.border}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>Şifreyi Yenile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: { padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
