// screens/VerifyCodeScreen.js
import React, { useState, useRef, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function VerifyCodeScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const { from, otp, uid, confirmationResult, userInfo } = route.params;

  const handleChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) inputs.current[index + 1].focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    try {
      if (from === "email" && fullCode === otp) {
        await updateDoc(doc(db, "users", uid), { verified: true });
        Alert.alert("Başarılı ✅", "E-posta doğrulandı.");
        navigation.replace("Vault");
      } else if (from === "sms") {
        const result = await confirmationResult.confirm(fullCode);
        if (result.user) {
          await updateDoc(doc(db, "users", result.user.uid), { verified: true });
          Alert.alert("Başarılı ✅", "Telefon doğrulandı.");
          navigation.replace("Vault");
        }
      } else {
        Alert.alert("Hata", "Kod yanlış!");
      }
    } catch (err) {
      Alert.alert("Doğrulama Hatası", err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Kod Doğrulama</Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.codeInput, { borderColor: theme.colors.primary }]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleVerify}>
        <Text style={styles.buttonText}>Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  codeContainer: { flexDirection: "row", marginBottom: 30 },
  codeInput: { width: 45, height: 55, borderWidth: 1, borderRadius: 8, textAlign: "center", fontSize: 20, marginHorizontal: 5 },
  button: { padding: 14, borderRadius: 8, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
