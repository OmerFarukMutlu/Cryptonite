// screens/VerifyCodeScreen.js
import React, { useState, useRef, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyCodeScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [rememberMe, setRememberMe] = useState(false);
  const inputs = useRef([]);

  const { from, otp, uid, confirmation } = route.params; // ✅ CLI'de genelde confirmation objesi

  const handleChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // otomatik sonraki inputa geç
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
    // geri silme
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      Alert.alert("Hata", "6 haneli kodu giriniz.");
      return;
    }

    try {
      if (from === "email" && fullCode === otp) {
        await firestore().collection("users").doc(uid).update({ verified: true });

        if (rememberMe) {
          await AsyncStorage.setItem("phoneVerifiedAt", Date.now().toString());
        }

        Alert.alert("Başarılı ✅", "E-posta doğrulandı.");
        navigation.reset({ index: 0, routes: [{ name: "Vault" }] });

      } else if (from === "sms") {
        const result = await confirmation.confirm(fullCode);
        if (result.user) {
          await firestore().collection("users").doc(result.user.uid).update({ verified: true });

          if (rememberMe) {
            await AsyncStorage.setItem("phoneVerifiedAt", Date.now().toString());
          }

          Alert.alert("Başarılı ✅", "Telefon doğrulandı.");
          navigation.reset({ index: 0, routes: [{ name: "Vault" }] });
        }
      } else {
        Alert.alert("Hata", "Kod doğrulanamadı!");
      }
    } catch (err) {
      console.log("❌ Verify Error:", err.message);
      Alert.alert("Doğrulama Hatası", err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Kod Doğrulama</Text>
      <Text style={{ color: theme.colors.text, marginBottom: 15 }}>
        Size gönderilen 6 haneli kodu giriniz
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[
              styles.codeInput,
              { borderColor: theme.colors.primary, color: theme.colors.text },
            ]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>

      {/* 30 gün boyunca sorma kutucuğu */}
      <TouchableOpacity
        onPress={() => setRememberMe(!rememberMe)}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            marginRight: 8,
            backgroundColor: rememberMe ? theme.colors.primary : "transparent",
          }}
        />
        <Text style={{ color: theme.colors.text }}>30 gün boyunca sorma</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  codeContainer: { flexDirection: "row", marginBottom: 30 },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  button: { padding: 14, borderRadius: 8, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
