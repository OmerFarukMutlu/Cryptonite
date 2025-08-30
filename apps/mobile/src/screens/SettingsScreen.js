// screens/SettingsScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function SettingsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth().currentUser;
        if (!user) return;
        const doc = await firestore().collection("users").doc(user.uid).get();
        if (doc.exists) {
          const data = doc.data();
          setName(data.name || "");
          setUsername(data.username || "");
          setPhone(data.phone || "");
          setEmail(data.email || user.email || "");
        }
      } catch (err) {
        Alert.alert("Hata", err.message);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;
      await firestore().collection("users").doc(user.uid).update({
        name,
        username,
        phone,
      });
      Alert.alert("Başarılı ✅", "Bilgiler güncellendi.");
    } catch (err) {
      Alert.alert("Hata", err.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;
      await auth().sendPasswordResetEmail(user.email);
      Alert.alert("Şifre Değişikliği", "Şifre yenileme linki e-posta adresine gönderildi.");
    } catch (err) {
      Alert.alert("Hata", err.message);
    }
  };

  const handleLogout = async () => {
    await auth().signOut();
    navigation.replace("Login");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Başlık + ikon */}
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/icons/settings.png")}
          style={styles.headerIcon} // ❌ tintColor yok → orijinal renk korunur
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>Ayarlar</Text>
      </View>

      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Ad"
        placeholderTextColor={theme.colors.border}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Kullanıcı Adı"
        placeholderTextColor={theme.colors.border}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Telefon"
        placeholderTextColor={theme.colors.border}
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.primary, color: theme.colors.text },
          styles.emailInput,
        ]}
        value={email}
        editable={false}
      />

      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
        <Text style={styles.buttonText}>Bilgileri Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.changePassButton]} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Şifre Değiştir</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcon: {
    width: 26,
    height: 26,
    marginRight: 8,
    resizeMode: "contain", // orijinal görünüm bozulmasın
  },
  title: { fontSize: 22, fontWeight: "bold" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  emailInput: {
    backgroundColor: "#eee",
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButton: { backgroundColor: "green" },
  changePassButton: { backgroundColor: "blue" },
  logoutButton: { backgroundColor: "red" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
