// screens/ChangePasswordScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

export default function ChangePasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleContinue = () => {
    // 🚀 Test için direkt VerifyCode'a yönlendir
    navigation.navigate("VerifyCode", { from: "changePassword" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/icons/changepassword.png")}
          style={styles.headerIcon}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>Şifre Değiştir</Text>
      </View>

      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Eski Şifre"
        placeholderTextColor={theme.colors.border}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Yeni Şifre"
        placeholderTextColor={theme.colors.border}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

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
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerIcon: {
    width: iconSize + 4,
    height: iconSize + 4,
    resizeMode: "contain",
    marginRight: 8,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
