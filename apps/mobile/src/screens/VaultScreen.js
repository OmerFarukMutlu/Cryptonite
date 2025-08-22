import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";

const vaultItems = [
  { id: "1", site: "gmail.com", username: "testuser", password: "123456" },
  { id: "2", site: "github.com", username: "coder123", password: "abcdef" },
];

export default function VaultScreen({ theme }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text, label) => {
    Alert.alert(`${label} kopyalandı!`, text);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.site, { color: theme.colors.text }]}>
          {item.site}
        </Text>
        <Text style={[styles.user, { color: theme.colors.text }]}>
          👤 {item.username}
        </Text>
        <Text style={[styles.pass, { color: theme.colors.text }]}>
          🔒 {visiblePasswords[item.id] ? item.password : "********"}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => copyToClipboard(item.username, "Kullanıcı adı")}
        >
          <Text style={styles.buttonText}>👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => copyToClipboard(item.password, "Şifre")}
        >
          <Text style={styles.buttonText}>🔑</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2196F3" }]}
          onPress={() => togglePassword(item.id)}
        >
          <Text style={styles.buttonText}>
            {visiblePasswords[item.id] ? "🙈" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/icons/lock.png")} style={styles.lockIcon} />
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Vault
        </Text>
      </View>

      <FlatList
        data={vaultItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  lockIcon: { width: 24, height: 24, marginRight: 8 },
  headerText: { fontSize: 22, fontWeight: "bold" },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  site: { fontSize: 16, fontWeight: "bold" },
  user: { fontSize: 14 },
  pass: { fontSize: 14 },

  actions: { flexDirection: "row" },
  button: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
