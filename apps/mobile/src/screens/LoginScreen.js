// screens/LoginScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 📌 Normalde burada backend doğrulaması yapılır
    // Eğer kullanıcı adı + şifre doğruysa:
    navigation.navigate("VerifyCode", { from: "login" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logo ve yazı yan yana */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icons/shield.png")}
          style={styles.logoIcon}
        />
        <Text style={[styles.logo, { color: theme.colors.primary }]}>
          Cryptonite
        </Text>
      </View>

      {/* Email veya Username alanı */}
      <TextInput
        placeholder="Email Veya Kullanıcı Adı"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={identifier}
        onChangeText={setIdentifier}
      />

      {/* Şifre alanı */}
      <TextInput
        placeholder="Şifre"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login butonu */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      {/* Register yönlendirme */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.link, { color: theme.colors.primary }]}>
          Hesabın yok mu? Kayıt Ol
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logoContainer: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  logoIcon: { width: iconSize + 12, height: iconSize + 12, resizeMode: "contain" },
  logo: { fontSize: 32, fontWeight: "bold", marginLeft: 12 },
  input: { width: "100%", borderWidth: 1, padding: 14, marginBottom: 15, borderRadius: 8, fontSize: 16 },
  button: { width: "100%", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 15, fontSize: 18 },
});
