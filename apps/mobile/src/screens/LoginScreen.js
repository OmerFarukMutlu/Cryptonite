// screens/LoginScreen.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔙 Android geri tuşu → Home
  useEffect(() => {
    const backAction = () => {
      navigation.replace("Home");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const normalizePhoneForLogin = (input) => {
    let phone = input.replace(/\s+/g, "");
    if (phone.startsWith("0") && phone.length === 11) {
      return "+90" + phone.substring(1);
    }
    return phone;
  };

  const handleLogin = async () => {
    if (loading) return;
    if (!identifier || !password) {
      Alert.alert("Hata", "Email / Kullanıcı adı / Telefon ve şifre gerekli!");
      return;
    }

    setLoading(true);
    try {
      let emailToLogin = null;

      // 📌 Email
      if (identifier.includes("@")) {
        emailToLogin = identifier;
      }
      // 📌 Telefon
      else if (/^\d+$/.test(identifier) || identifier.startsWith("+")) {
        const normalized = normalizePhoneForLogin(identifier);
        const snap = await firestore()
          .collection("users")
          .where("phone", "==", normalized)
          .get();
        if (!snap.empty) {
          emailToLogin = snap.docs[0].data().email;
        }
      }
      // 📌 Kullanıcı adı
      else {
        const snap = await firestore()
          .collection("users")
          .where("username", "==", identifier)
          .get();
        if (!snap.empty) {
          emailToLogin = snap.docs[0].data().email;
        }
      }

      if (!emailToLogin) {
        Alert.alert("Hata", "Kullanıcı bulunamadı!");
        return;
      }

      // ✅ Firebase Auth login
      const userCredential = await auth().signInWithEmailAndPassword(emailToLogin, password);
      const user = userCredential.user;

      // 📌 Email verified kontrolü
      await user.reload();
      if (!user.emailVerified) {
        Alert.alert("Doğrulama Gerekli", "Email adresini doğrulamadan devam edemezsin.");
        navigation.replace("VerifyEmailPending");
        return;
      }

      // 🔑 Token yenile
      await user.getIdToken(true);

      // ✅ Vault’a yönlendir
      navigation.reset({ index: 0, routes: [{ name: "Vault" }] });
    } catch (error) {
      console.log("❌ Login Error:", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        Alert.alert("Giriş Hatası", "Kullanıcı bulunamadı.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Giriş Hatası", "Şifre hatalı.");
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert("Hata", "Çok fazla deneme yapıldı. Daha sonra dene.");
      } else {
        Alert.alert("Giriş Hatası", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/icons/shield.png")} style={styles.logoIcon} />
        <Text style={[styles.logo, { color: theme.colors.primary }]}>Cryptonite</Text>
      </View>

      {/* Identifier */}
      <TextInput
        placeholder="Email / Kullanıcı adı / Telefon"
        placeholderTextColor={theme.colors.border}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
            color: theme.colors.text,
          },
        ]}
        value={identifier}
        onChangeText={setIdentifier}
      />

      {/* Password */}
      <View
        style={[
          styles.passwordContainer,
          { borderColor: theme.colors.primary, backgroundColor: theme.colors.card },
        ]}
      >
        <TextInput
          placeholder="Şifre"
          placeholderTextColor={theme.colors.border}
          style={[styles.passwordInput, { color: theme.colors.text }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? require("../assets/icons/hide.png")
                : require("../assets/icons/eye.png")
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Giriş Yap */}
      <TouchableOpacity
        disabled={loading}
        style={[styles.button, loading ? styles.buttonDisabled : { backgroundColor: theme.colors.primary }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>{loading ? "Bekleyin..." : "Giriş Yap"}</Text>
      </TouchableOpacity>

      {/* Links */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.link, { color: theme.colors.primary }]}>Şifremi Unuttum?</Text>
      </TouchableOpacity>
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
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  eyeIcon: { width: 24, height: 24, marginLeft: 8, resizeMode: "contain" },
  button: { width: "100%", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonDisabled: { backgroundColor: "gray" }, // 🔹 inline kaldırıldı
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 15, fontSize: 18 },
});
