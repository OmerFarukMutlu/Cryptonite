import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [identifier, setIdentifier] = useState("");

  const normalizePhone = (input) => {
    let phone = input.replace(/\s+/g, "");
    if (phone.startsWith("0") && phone.length === 11) {
      return "+90" + phone.substring(1);
    }
    return phone;
  };

  const handleReset = async () => {
    if (!identifier) {
      Alert.alert("Hata", "Lütfen email / kullanıcı adı / telefon giriniz.");
      return;
    }

    try {
      let emailToSend = null;

      // 📌 Email ise
      if (identifier.includes("@")) {
        emailToSend = identifier;
      }
      // 📌 Telefon ise
      else if (/^\d+$/.test(identifier) || identifier.startsWith("+")) {
        const normalized = normalizePhone(identifier);
        const snap = await firestore().collection("users").where("phone", "==", normalized).get();
        if (!snap.empty) {
          emailToSend = snap.docs[0].data().email;
        }
      }
      // 📌 Username ise
      else {
        const snap = await firestore().collection("users").where("username", "==", identifier).get();
        if (!snap.empty) {
          emailToSend = snap.docs[0].data().email;
        }
      }

      if (!emailToSend) {
        Alert.alert("Hata", "Bu bilgilere ait kullanıcı bulunamadı.");
        return;
      }

      await auth().sendPasswordResetEmail(emailToSend);
      Alert.alert("Başarılı", `Şifre sıfırlama maili ${emailToSend} adresine gönderildi.`);

      // ✅ Replace yerine reset kullan → ekran kayması olmaz
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

    } catch (err) {
      Alert.alert("Hata", err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Şifremi Unuttum</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholder="Email / Kullanıcı adı / Telefon"
        placeholderTextColor={theme.colors.border}
        value={identifier}
        onChangeText={setIdentifier}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>Şifre Sıfırlama Maili Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: { padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
