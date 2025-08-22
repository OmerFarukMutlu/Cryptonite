import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

export default function VaultItem({ item }) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert(`${label} kopyalandı!`);
  };

  return (
    <View style={styles.card}>
      {/* Sol taraf: site ikonu */}
      <Image source={require("../../assets/icons/lock.png")} style={styles.icon} />

      {/* Ortadaki bilgiler */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.site}>{item.site}</Text>
        <Text style={styles.user}>👤 {item.username}</Text>
        <Text style={styles.pass}>
          🔒 {showPassword ? item.password : "********"}
        </Text>
      </View>

      {/* Sağdaki butonlar */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => copyToClipboard(item.username, "Kullanıcı adı")}>
          <Text style={styles.buttonText}>👤</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => copyToClipboard(item.password, "Şifre")}>
          <Text style={styles.buttonText}>🔑</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.buttonText}>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  icon: { width: 30, height: 30 },
  site: { fontSize: 16, fontWeight: "bold" },
  user: { fontSize: 14, color: "#444" },
  pass: { fontSize: 14, color: "#777" },
  actions: { flexDirection: "row" },
  button: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
