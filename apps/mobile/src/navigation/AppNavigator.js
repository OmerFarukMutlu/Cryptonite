// navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VaultScreen from "../screens/VaultScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyEmailPendingScreen from "../screens/VerifyEmailPendingScreen";

import { useThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

const Stack = createNativeStackNavigator();

// 🔹 Tema Toggle Butonu
const ThemeToggleButton = ({ isDark, toggleTheme }) => (
  <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
    <Image
      source={isDark ? require("../assets/icons/moon.png") : require("../assets/icons/sun.png")}
      style={styles.themeIcon}
    />
  </TouchableOpacity>
);

// 🔹 Wrapper HOC
const withTheme = (Component) => (props) => {
  const { theme } = useThemeContext();
  return <Component {...props} theme={theme} />;
};

// 🔹 HeaderRight
const getHeaderRight = (isDark, toggleTheme) => () =>
  <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />;

// 🔹 Vault özel header
const getVaultHeaderOptions = (isDark, toggleTheme, navigation) => ({
  headerLeft: () => (
    <TouchableOpacity
      style={styles.settingsButton}
      onPress={() => navigation.navigate("Settings")}
    >
      <Image source={require("../assets/icons/settings.png")} style={styles.settingsIcon} />
    </TouchableOpacity>
  ),
  headerRight: getHeaderRight(isDark, toggleTheme),
  headerTitle: "Cryptonite",
  headerTitleAlign: "center",
});

export default function AppNavigator() {
  const { theme, isDark, toggleTheme } = useThemeContext();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerTintColor: "white",
          headerTitleStyle: styles.headerTitle,
          animation: "none",          // 🔹 animasyonları kapattık
          headerShadowVisible: false, // 🔹 iOS alt çizgi kaldırıldı
          gestureEnabled: false,      // 🔹 swipe back kapalı (kayma olmasın)
        }}
      >
        <Stack.Screen
          name="Home"
          component={withTheme(HomeScreen)}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={withTheme(LoginScreen)}
          options={{
            headerTitle: "Giriş Yap",
            headerLeft: () => null,
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        <Stack.Screen
          name="Register"
          component={withTheme(RegisterScreen)}
          options={{
            headerTitle: "Kayıt Ol",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        <Stack.Screen
          name="VerifyEmailPending"
          component={withTheme(VerifyEmailPendingScreen)}
          options={{
            headerTitle: "Email Doğrulama",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={withTheme(ForgotPasswordScreen)}
          options={{
            headerTitle: "Şifremi Unuttum",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        <Stack.Screen
          name="Vault"
          component={withTheme(VaultScreen)}
          options={({ navigation }) =>
            getVaultHeaderOptions(isDark, toggleTheme, navigation)
          }
        />

        <Stack.Screen
          name="Settings"
          component={withTheme(SettingsScreen)}
          options={{
            headerTitle: "Ayarlar",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "green",
  },
  headerTitle: {
    fontWeight: "normal",
    fontSize: 20,
  },
  themeButton: { marginRight: 15 },
  themeIcon: { width: iconSize + 4, height: iconSize + 4, resizeMode: "contain" },
  settingsButton: { marginLeft: 15 },
  settingsIcon: { width: iconSize + 4, height: iconSize + 4, resizeMode: "contain" },
});
