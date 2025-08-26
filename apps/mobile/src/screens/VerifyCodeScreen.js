// screens/VerifyCodeScreen.js
import React, { useState, useRef, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function VerifyCodeScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const from = route.params?.from; // forgotPassword veya changePassword

  const handleChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) inputs.current[index + 1].focus();
  };

  const handleVerify = () => {
    // 🚀 Test için: 6 hane girildi mi → yönlendir
    if (from === "changePassword") {
      navigation.replace("Settings");
    } else {
      navigation.replace("Vault");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Kod Doğrulama</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
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
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center" }, // ✅ inline kaldırıldı
  codeContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
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
