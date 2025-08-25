import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

export default function VaultItem({ item }) {
  const { theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  const isEmail = item.username.includes("@");
  const label = isEmail ? "Email" : "Kullanıcı adı";
  const icon = isEmail
    ? require("../assets/icons/email.png")
    : require("../assets/icons/user.png");

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert(`${label} kopyalandı ✅`, text);
  };

  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.colors.primary, backgroundColor: theme.colors.card },
      ]}
    >
      <View style={{ flex: 1 }}>
        {/* Site */}
        <Text style={[styles.site, { color: theme.colors.text }]}>{item.site}</Text>

        {/* Kullanıcı adı / Email */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Image source={icon} style={styles.smallIcon} />
          <Text style={[styles.user, { color: theme.colors.text, marginLeft: 6 }]}>
            {item.username}
          </Text>
        </View>

        {/* Şifre */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Image source={require("../assets/icons/lock2.png")} style={styles.smallIcon} />
          <Text style={[styles.pass, { color: theme.colors.text, marginLeft: 6 }]}>
            {showPassword ? item.password : "********"}
          </Text>
        </View>
      </View>

      {/* Sağdaki butonlar */}
      <View style={styles.actions}>
        {/* Username / Email kopyala */}
        <TouchableOpacity onPress={() => copyToClipboard(item.username, label)}>
          <Image source={icon} style={styles.icon} />
        </TouchableOpacity>

        {/* Şifre kopyala */}
        <TouchableOpacity onPress={() => copyToClipboard(item.password, "Şifre")}>
          <Image source={require("../assets/icons/key.png")} style={styles.icon} />
        </TouchableOpacity>

        {/* Şifre göster/gizle */}
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? require("../assets/icons/hide.png")
                : require("../assets/icons/eye.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  site: { fontSize: 16, fontWeight: "bold" },
  user: { fontSize: 14 },
  pass: { fontSize: 14 },

  smallIcon: {
    width: iconSize - 8, // 🔹 küçük ikonlar
    height: iconSize - 8,
    resizeMode: "contain",
  },

  actions: { flexDirection: "row", alignItems: "center" },
  icon: {
    width: iconSize,
    height: iconSize,
    resizeMode: "contain",
    marginLeft: 10,
  },
});
