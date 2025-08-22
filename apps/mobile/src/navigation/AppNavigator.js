// navigation/AppNavigator.js
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VaultScreen from "../screens/VaultScreen";   // ✅ Vault import edildi
import { lightTheme, darkTheme } from "../theme/theme";

const Stack = createNativeStackNavigator();

function HeaderToggle({ onPress, isDark }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton}>
      <Image
        source={
          isDark
            ? require("../assets/icons/sun.png")   // 🌞 dark modda GÜNEŞ
            : require("../assets/icons/moon.png")  // 🌙 light modda AY
        }
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: "Cryptonite",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "green", // ✅ Üst bar yeşil
          },
          headerTintColor: "white", // ✅ Yazılar beyaz
          headerTitleStyle: {
            fontWeight: "normal",
            fontSize: 20,
          },
          headerRight: () => (
            <HeaderToggle onPress={toggleTheme} isDark={isDark} />
          ),
        }}
      >
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(props) => <RegisterScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="Vault">
          {(props) => <VaultScreen {...props} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
  icon: {
    width: 32,  // 🔥 biraz büyüttük daha rahat basılır
    height: 32,
    resizeMode: "contain",
  },
});
