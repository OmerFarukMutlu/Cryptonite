import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function LoginScreen({ navigation, theme }) {
  const [identifier, setIdentifier] = useState(""); // email veya username olabilir
  const [password, setPassword] = useState("");

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
        placeholder="Email and Username"
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
        placeholder="Password"
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
  onPress={() => navigation.navigate("Vault")}   // 👈 buraya yönlendirme
>
  <Text style={styles.buttonText}>Login</Text>
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
  logoIcon: { width: 32, height: 32, resizeMode: "contain" },
  logo: { fontSize: 30, fontWeight: "bold", marginLeft: 10 },
  input: { width: "100%", borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { width: "100%", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, fontSize: 20 },
});
