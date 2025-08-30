// screens/RegisterScreen.js
import React, { useState, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Alert, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";
import countryCodes from "../utils/countryCodes.json";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

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
      Alert.alert("Hata", "Telefon numarası 10 haneli olmalı!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor!");
      return;
    }

    try {
      // 🔹 Kullanıcı oluştur
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // 🔑 İlk token refresh → updateEmail / updatePassword gibi işlemler için "recent login" garantisi
      await user.getIdToken(true);

      // 🔹 Firestore’a kaydet
      await firestore().collection("users").doc(user.uid).set({
        name,
        username,
        phone: countryCode + phone,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // 🔹 Email doğrulama gönder
      await user.sendEmailVerification();
      Alert.alert("Doğrulama Gönderildi", "Email adresini kontrol et!");

      // 🔹 Doğrulama bekleme ekranına yönlendir
      navigation.replace("VerifyEmailPending");

    } catch (error) {
      console.log("Register Error:", error.code, error.message);
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

        {/* Ad */}
        <View style={[styles.inputContainer, { borderColor: theme.colors.primary }]}>
          <TextInput placeholder="Ad" value={name} onChangeText={setName} style={styles.textInput}/>
        </View>

        {/* Kullanıcı adı */}
        <View style={[styles.inputContainer, { borderColor: theme.colors.primary }]}>
          <TextInput placeholder="Kullanıcı Adı" value={username} onChangeText={setUsername} style={styles.textInput}/>
        </View>

        {/* Telefon */}
        <View style={[styles.phoneRow, { borderColor: theme.colors.primary }]}>
          <Picker selectedValue={countryCode} style={{ width: 150 }} onValueChange={setCountryCode}>
            {countryCodes.map((c, i) => (
              <Picker.Item key={i} label={`${c.name} (${c.code})`} value={c.code} />
            ))}
          </Picker>
          <TextInput
            placeholder="Başında 0 olmadan"
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.phoneInput}
          />
        </View>

        {/* Email */}
        <View style={[styles.inputContainer, { borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
            keyboardType="email-address"
          />
        </View>

        {/* Şifre */}
        <View style={[styles.inputContainer, { borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? require("../assets/icons/hide.png") : require("../assets/icons/eye.png")}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Şifre onayı */}
        <View style={[styles.inputContainer, { borderColor: theme.colors.primary }]}>
          <TextInput
            placeholder="Şifre Onayı"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image
              source={showConfirmPassword ? require("../assets/icons/hide.png") : require("../assets/icons/eye.png")}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Kayıt butonu */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  logoContainer: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  logoIcon: { width: iconSize + 12, height: iconSize + 12 },
  logo: { fontSize: 32, fontWeight: "bold", marginLeft: 12 },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  phoneInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  eyeIcon: { width: 22, height: 22, resizeMode: "contain" },
  button: { width: "100%", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
