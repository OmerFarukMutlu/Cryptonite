// screens/ForgotPasswordScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [contact, setContact] = useState("");

  const handleSendCode = () => {
    // 🚀 Test için direkt VerifyCode'a yönlendir
    navigation.navigate("VerifyCode", { from: "forgotPassword" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Başlık + ikon */}
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/icons/forgot.png")} // ✅ kendi icon yolun
          style={styles.headerIcon}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>Şifremi Unuttum</Text>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.colors.primary,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
          },
        ]}
        placeholder="Email veya Telefon"
        placeholderTextColor={theme.colors.border}
        value={contact}
        onChangeText={setContact}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSendCode}
      >
        <Text style={styles.buttonText}>Kod Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // ✅ ortalar
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
  button: { padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
