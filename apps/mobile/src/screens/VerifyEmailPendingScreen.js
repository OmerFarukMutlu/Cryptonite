// screens/VerifyEmailPendingScreen.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function VerifyEmailPendingScreen({ navigation }) {
  const { theme, isDark } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ⏱️ Cooldown sayacı
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // 📩 Tekrar gönder
  const handleResend = async () => {
    if (cooldown > 0) {
      Alert.alert("Bekle", `${cooldown} saniye içinde tekrar deneyebilirsin.`);
      return;
    }
    try {
      setResending(true);
      const user = auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
        Alert.alert("Tekrar Gönderildi", "Mail kutunu (Spam dahil) kontrol et!");
        setCooldown(60);
      }
    } catch (err) {
      Alert.alert("Hata", err.message);
    } finally {
      setResending(false);
    }
  };

  // ✅ Doğrulama kontrolü
  const handleCheckVerified = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) {
        navigation.replace("Login");
        return;
      }

      await new Promise((res) => setTimeout(res, 500));
      await user.reload();
      const refreshedUser = auth().currentUser;

      if (refreshedUser.emailVerified) {
        await firestore().collection("users").doc(refreshedUser.uid).update({
          verified: true,
        });
        Alert.alert("Başarılı ✅", "Email doğrulandı!");
        // ❌ navigation.replace("Vault") kaldırıldı
        // App.js -> onAuthStateChanged otomatik Vault’a yönlendirecek
      } else {
        Alert.alert(
          "Henüz Doğrulanmadı",
          "Emailini kontrol et ve doğrulama linkine tıkla."
        );
      }
    } catch (err) {
      Alert.alert("Hata", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Çıkış
  const handleGoLogin = async () => {
    try {
      await auth().signOut();
      // burada da reset gerek yok, App.js null user ile Login/Home stack’i açacak
    } catch (err) {
      Alert.alert("Hata", err.message);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Email Doğrulaması Bekleniyor
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Email adresine bir doğrulama linki gönderdik. Mail kutunu kontrol et
        (Spam klasörünü unutma).
      </Text>

      {/* Tekrar Gönder */}
      <TouchableOpacity
        style={[styles.button, styles.orange, isDark && styles.darkShadow]}
        onPress={handleResend}
        disabled={resending || cooldown > 0}
      >
        {resending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {cooldown > 0 ? `Tekrar Gönder (${cooldown})` : "Tekrar Gönder"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Doğruladım */}
      <TouchableOpacity
        style={[styles.button, styles.green, isDark && styles.darkShadow]}
        onPress={handleCheckVerified}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Doğruladım ✅</Text>
        )}
      </TouchableOpacity>

      {/* Giriş Ekranına Dön */}
      <TouchableOpacity
        style={[styles.button, styles.red, isDark && styles.darkShadow]}
        onPress={handleGoLogin}
      >
        <Text style={styles.buttonText}>Giriş Ekranına Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  orange: { backgroundColor: "#FFA000", elevation: 6 },
  green: { backgroundColor: "#4CAF50", elevation: 6 },
  red: { backgroundColor: "#D32F2F", elevation: 6 },
  darkShadow: { shadowOpacity: 1, shadowRadius: 15, elevation: 12 },
});
