// screens/SettingsScreen.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  BackHandler,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function SettingsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState("testuser");
  const [email, setEmail] = useState("testuser@mail.com");
  const [phone, setPhone] = useState("05555555555");

  // 🔹 Android donanım geri tuşu → Vault’a dönsün (çıkış yapılmadıysa)
  useEffect(() => {
    const backAction = () => {
      navigation.replace("Vault");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleSave = () => {
    Alert.alert(
      "Bilgiler güncellendi ✅",
      `Kullanıcı: ${username}\nE-mail: ${email}\nTelefon: ${phone}`
    );
  };

  const handleLogout = () => {
    Alert.alert("Çıkış Yapıldı 👋");
    // ✅ Stack sıfırla → geri tuşuyla Vault’a dönemez
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Üst kısım: settings ikonu + başlık */}
      <View style={styles.headerRow}>
        <View style={styles.rowCenter}>
          <Image
            source={require("../assets/icons/settings.png")}
            style={styles.settingsIcon} // ✅ orijinal renk korunuyor
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
        style={[styles.button, { backgroundColor: theme.colors.button.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>

      {/* Şifre Değiştir */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button.warning }]}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Text style={styles.buttonText}>Şifre Değiştir</Text>
      </TouchableOpacity>

      {/* Çıkış */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button.danger }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Çıkış Yap</Text>
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
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    width: 26,
    height: 26,
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
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
