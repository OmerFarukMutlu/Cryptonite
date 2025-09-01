// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  Alert,
  NativeModules,
} from "react-native";
import { useThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

const { AutofillModule } = NativeModules;

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useThemeContext();

  const openAutofillSettings = () => {
    if (Platform.OS === "android") {
      if (AutofillModule?.openAutofillSettings) {
        AutofillModule.openAutofillSettings();
      } else {
        Alert.alert("Hata", String("Autofill ayar modülü yüklenemedi."));
      }
    } else {
      Alert.alert(
        "Bilgi",
        String("iOS tarafında Ayarlar > Parolalar & Otomatik Doldurma üzerinden etkinleştirin.")
      );
    }
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}>
      {/* ✅ StatusBar */}
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />

      {/* Sağ üstte tema değiştir butonu */}
      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Image
          source={
            isDark
              ? require("../assets/icons/moon.png")
              : require("../assets/icons/sun.png")
          }
          style={styles.themeIcon}
        />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require("../assets/icons/shield.png")} style={styles.logo} />

      {/* Başlık */}
      <Text style={[styles.title, { color: theme.colors.text }]}>Cryptonite</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>Dijital Kasanız</Text>

      {/* Bilgilendirme */}
      <Text style={[styles.infoText, { color: theme.colors.text }]}>
        {"Uygulamayı kullanabilmek için cihaz ayarlarından\nCryptonite’i otomatik doldurma sağlayıcısı olarak seçin."}
      </Text>

      {/* Otomatik Doldurma Ayarları Butonu */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button.primary }]}
        onPress={openAutofillSettings}
      >
        <Text style={styles.buttonText}>Otomatik Doldurma Ayarlarını Aç</Text>
      </TouchableOpacity>

      {/* Giriş */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button.primary }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      {/* Kayıt */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button.primary }]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  themeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  themeIcon: {
    width: iconSize + 4,
    height: iconSize + 4,
    resizeMode: "contain",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  infoText: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  button: {
    padding: 16,
    borderRadius: 25,
    width: "90%",
    marginBottom: 15,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#39FF14",
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
