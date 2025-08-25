// screens/RegisterScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logo ve yazı yan yana */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icons/shield.png")}
          style={styles.logoIcon} // ✅ tintColor kaldırıldı
        />
        <Text style={[styles.logo, { color: theme.colors.primary }]}>
          Cryptonite
        </Text>
      </View>

      {/* Name */}
      <TextInput
        placeholder="Ad"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={name}
        onChangeText={setName}
      />

      {/* Username */}
      <TextInput
        placeholder="Kullanıcı Adı"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={username}
        onChangeText={setUsername}
      />

      {/* Phone */}
      <TextInput
        placeholder="Telefon Numarası"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password */}
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

      {/* Confirm Password */}
      <TextInput
        placeholder="Şifre Onayı"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text }
        ]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Register Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      {/* Login yönlendirme */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.link, { color: theme.colors.primary }]}>
          Zaten hesabın var mı? Giriş yap
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logoContainer: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  logoIcon: { width: iconSize + 12, height: iconSize + 12, resizeMode: "contain" }, // ✅ orijinal renk
  logo: { fontSize: 32, fontWeight: "bold", marginLeft: 12 },
  input: { width: "100%", borderWidth: 1, padding: 14, marginBottom: 15, borderRadius: 8, fontSize: 16 },
  button: { width: "100%", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 15, fontSize: 18 },
});
