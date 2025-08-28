// screens/RegisterScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

// JSON ülke kodları
import countryCodes from "../utils/countryCodes.json";

export default function RegisterScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+90");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  // 📌 Telefon validasyonu: sadece 10 rakam (başında 0 olmayacak)
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const handleRegister = async () => {
    if (!name || !username || !phone || !email || !password) {
      Alert.alert("Hata", "Tüm alanları doldurun!");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Hata", "Geçerli bir email giriniz!");
      return;
    }
    if (!isValidPhone(phone)) {
      Alert.alert("Hata", "Telefon numarası 10 haneli olmalı (başında 0 olmadan)!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ DB’ye daima +kodlu format kaydediyoruz
      await setDoc(doc(db, "users", user.uid), {
        name,
        username,
        phone: countryCode + phone, 
        email,
        createdAt: new Date(),
      });

      Alert.alert("Başarılı ✅", "Kayıt tamamlandı!");
      navigation.replace("Vault");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Kayıt Hatası", "Bu email adresi zaten kullanılıyor.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Kayıt Hatası", "Şifre en az 6 karakter olmalı.");
      } else {
        Alert.alert("Kayıt Hatası", error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/icons/shield.png")} style={styles.logoIcon} />
          <Text style={[styles.logo, { color: theme.colors.primary }]}>Cryptonite</Text>
        </View>

        {/* Name */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Ad"
            placeholderTextColor={theme.colors.border}
            style={[styles.textInput, { color: theme.colors.text }]}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Username */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Kullanıcı Adı"
            placeholderTextColor={theme.colors.border}
            style={[styles.textInput, { color: theme.colors.text }]}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Phone */}
        <View style={[styles.phoneRow, { borderColor: theme.colors.primary, backgroundColor: theme.colors.card }]}>
          <Picker
            selectedValue={countryCode}
            style={{ width: 150, color: theme.colors.text }}
            onValueChange={(itemValue) => setCountryCode(itemValue)}
          >
            {countryCodes.map((c, i) => (
              <Picker.Item key={i} label={`${c.name} (${c.code})`} value={c.code} />
            ))}
          </Picker>
          <TextInput
            placeholder="Başında 0 olmadan"
            placeholderTextColor={theme.colors.border}
            style={[styles.phoneInput, { color: theme.colors.text }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        {/* Email */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.colors.border}
            style={[styles.textInput, { color: theme.colors.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Şifre"
            placeholderTextColor={theme.colors.border}
            style={[styles.textInput, { color: theme.colors.text }]}
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

        {/* Confirm Password */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Şifre Onayı"
            placeholderTextColor={theme.colors.border}
            style={[styles.textInput, { color: theme.colors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image
              source={showConfirmPassword ? require("../assets/icons/hide.png") : require("../assets/icons/eye.png")}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>

        {/* Login yönlendirme */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            Zaten hesabın var mı? Giriş yap
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logoContainer: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  logoIcon: { width: iconSize + 12, height: iconSize + 12, resizeMode: "contain" },
  logo: { fontSize: 32, fontWeight: "bold", marginLeft: 12 },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  phoneInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%"
  },
  textInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  eyeIcon: { width: 22, height: 22, resizeMode: "contain" },
  button: { width: "100%", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 15, fontSize: 18 },
});
