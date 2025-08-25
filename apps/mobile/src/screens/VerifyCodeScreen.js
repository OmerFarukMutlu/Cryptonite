import React, { useRef, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function VerifyCodeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) inputs.current[index + 1].focus();
    if (!text && index > 0) inputs.current[index - 1].focus();
  };

  const handleVerify = () => {
    // ✅ Backend yok → test için direkt Vault'a yönlendiriyoruz
    navigation.replace("Vault");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/icons/verify.png")}
          style={styles.headerIcon}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>SMS Doğrulama</Text>
      </View>

      <Text style={[styles.subText, { color: theme.colors.text }]}>
        Telefonunuza gönderilen 6 haneli kodu giriniz
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerIcon: { width: 40, height: 40, resizeMode: "contain", marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold" },
  subText: { fontSize: 16, marginBottom: 30, textAlign: "center" },
  codeContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 30 },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  button: { width: "100%", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
