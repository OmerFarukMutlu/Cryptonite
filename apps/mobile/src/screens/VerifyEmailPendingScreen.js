// screens/VerifyEmailPendingScreen.js
import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { auth, db } from "../firebase/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function VerifyEmailPendingScreen({ navigation }) {
  const { theme, isDark } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert("Tekrar Gönderildi", "Mail kutunu (Spam dahil) kontrol et!");
      }
    } catch (err) {
      Alert.alert("Hata", err.message);
    }
  };

  const handleCheckVerified = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        navigation.replace("Login");
        return;
      }
      await user.reload();
      if (user.emailVerified) {
        await updateDoc(doc(db, "users", user.uid), { verified: true });
        Alert.alert("Başarılı ✅", "Email doğrulandı!");
        navigation.reset({ index: 0, routes: [{ name: "Vault" }] });
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const createdAt = data.createdAt.toDate();
          const now = new Date();
          const diff = (now - createdAt) / (1000 * 60 * 60 * 24);
          if (diff > 2) {
            await deleteDoc(doc(db, "users", user.uid));
            await user.delete();
            Alert.alert("Hesap Silindi", "2 gün içinde doğrulama yapılmadığı için hesabın süresi doldu.");
            navigation.replace("Register");
            return;
          }
        }
        Alert.alert("Henüz Doğrulanmadı", "Emailini kontrol et ve linke tıkla.");
      }
    } catch (err) {
      Alert.alert("Hata", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Email Doğrulaması Bekleniyor</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Email adresine bir doğrulama linki gönderdik. Lütfen mail kutunu kontrol et (Spam klasörünü de unutma).
      </Text>

      {/* Tekrar Gönder */}
      <TouchableOpacity
        style={[styles.button, styles.neonOrange, isDark && styles.neonDarkShadow]}
        onPress={handleResend}
      >
        <Text style={styles.buttonText}>Tekrar Gönder</Text>
      </TouchableOpacity>

      {/* Doğruladım */}
      <TouchableOpacity
        style={[styles.button, styles.neonGreen, isDark && styles.neonDarkShadow]}
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
        style={[styles.button, styles.neonRed, isDark && styles.neonDarkShadow]}
        onPress={() => navigation.replace("Login")}
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

  // Neon renkler
  neonOrange: {
    backgroundColor: "#FFA000",
    shadowColor: "#FFA000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  neonGreen: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  neonRed: {
    backgroundColor: "#D32F2F",
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  neonDarkShadow: {
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 12,
  },
});
