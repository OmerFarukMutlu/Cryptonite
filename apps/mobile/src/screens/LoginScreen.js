// screens/LoginScreen.js
import React, { useState, useContext } from "react";
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

import { signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Android geri tuşu → Home ekranına
  React.useEffect(() => {
    const backAction = () => {
      navigation.replace("Home");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // 📌 Telefon numarasını normalize et
  const normalizePhoneForLogin = (input) => {
    let phone = input.replace(/\s+/g, "");
    if (phone.startsWith("0") && phone.length === 11) {
      return "+90" + phone.substring(1);
    }
    return phone;
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Hata", "Email / Kullanıcı adı / Telefon ve şifre gerekli!");
      return;
    }

    try {
      let emailToLogin = identifier;

      // 1) Email
      if (identifier.includes("@")) {
        emailToLogin = identifier;
      }
      // 2) Telefon
      else if (/^\d+$/.test(identifier) || identifier.startsWith("+")) {
        const normalized = normalizePhoneForLogin(identifier);
        const q = query(collection(db, "users"), where("phone", "==", normalized));
        const snap = await getDocs(q);
        if (snap.empty) {
          Alert.alert("Hata", "Telefon numarası bulunamadı");
          return;
        }
        emailToLogin = snap.docs[0].data().email;
      }
      // 3) Username
      else {
        const q = query(collection(db, "users"), where("username", "==", identifier));
        const snap = await getDocs(q);
        if (snap.empty) {
          Alert.alert("Hata", "Kullanıcı adı bulunamadı");
          return;
        }
        emailToLogin = snap.docs[0].data().email;
      }

      // ✅ Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(auth, emailToLogin, password);
      const user = userCredential.user;

      // 🔍 Firestore'dan kullanıcı bilgilerini çek
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        Alert.alert("Hata", "Kullanıcı Firestore'da bulunamadı!");
        return;
      }

      const data = userDoc.data();
      const createdAt = data.createdAt.toDate();
      const now = new Date();
      const diff = (now - createdAt) / (1000 * 60 * 60 * 24); // gün farkı

      // 🔄 Email verified kontrolü
      await user.reload();
      if (!user.emailVerified) {
        if (diff > 2) {
          // 2 gün geçtiyse hesap sil
          await deleteDoc(doc(db, "users", user.uid));
          await deleteUser(user);
          Alert.alert("Hesap Silindi", "Doğrulama yapılmadığı için hesabın süresi doldu.");
          navigation.replace("Register");
          return;
        } else {
          Alert.alert("Doğrulama Gerekli", "Email adresini doğrulamadan Vault’a erişemezsin.");
          navigation.replace("VerifyEmailPending");
          return;
        }
      }

      // ✅ Doğrulama başarılı → Vault’a yönlendir
      navigation.reset({
        index: 0,
        routes: [{ name: "Vault" }],
      });

    } catch (error) {
      console.log("❌ Login Error:", error.code, error.message);
      if (error.code === "auth/invalid-email") {
        Alert.alert("Giriş Hatası", "Geçersiz email.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Giriş Hatası", "Böyle bir kullanıcı yok.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Giriş Hatası", "Şifre yanlış.");
      } else {
        Alert.alert("Giriş Hatası", error.message);
      }
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
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, color: theme.colors.text },
        ]}
        value={identifier}
        onChangeText={setIdentifier}
      />

      {/* Password + Eye */}
      <View style={[
        styles.passwordContainer,
        { borderColor: theme.colors.primary, backgroundColor: theme.colors.card },
      ]}>
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
            source={showPassword ? require("../assets/icons/hide.png") : require("../assets/icons/eye.png")}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Giriş Yap */}
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      {/* Şifremi Unuttum */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.link, { color: theme.colors.primary, marginTop: 10 }]}>Şifremi Unuttum?</Text>
      </TouchableOpacity>

      {/* Kayıt Ol */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.link, { color: theme.colors.primary }]}>Hesabın yok mu? Kayıt Ol</Text>
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
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 15, fontSize: 18 },
});
