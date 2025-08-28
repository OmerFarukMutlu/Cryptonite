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
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import VerifyEmailPendingScreen from "../screens/VerifyEmailPendingScreen"; // ✅ yeni ekran

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

// 🔹 Wrapper componentler
function HomeWrapper(props) { const { theme } = useThemeContext(); return <HomeScreen {...props} theme={theme} />; }
function LoginWrapper(props) { const { theme } = useThemeContext(); return <LoginScreen {...props} theme={theme} />; }
function RegisterWrapper(props) { const { theme } = useThemeContext(); return <RegisterScreen {...props} theme={theme} />; }
function ForgotPasswordWrapper(props) { const { theme } = useThemeContext(); return <ForgotPasswordScreen {...props} theme={theme} />; }
function VerifyCodeWrapper(props) { const { theme } = useThemeContext(); return <VerifyCodeScreen {...props} theme={theme} />; }
function ChangePasswordWrapper(props) { const { theme } = useThemeContext(); return <ChangePasswordScreen {...props} theme={theme} />; }
function VaultWrapper(props) { const { theme } = useThemeContext(); return <VaultScreen {...props} theme={theme} />; }
function SettingsWrapper(props) { const { theme } = useThemeContext(); return <SettingsScreen {...props} theme={theme} />; }
function VerifyEmailPendingWrapper(props) { const { theme } = useThemeContext(); return <VerifyEmailPendingScreen {...props} theme={theme} />; }

// 🔹 HeaderRight fonksiyonu
const getHeaderRight = (isDark, toggleTheme) => () =>
  <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />;

// 🔹 Vault özel header (settings + theme)
const getVaultHeaderOptions = (isDark, toggleTheme, navigation) => ({
  headerLeft: () => (
    <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
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
          headerTitle: "Cryptonite",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "green" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "normal", fontSize: 20 },
        }}
      >
        {/* Home */}
        <Stack.Screen name="Home" component={HomeWrapper} options={{ headerShown: false }} />

        {/* Login */}
        <Stack.Screen
          name="Login"
          component={LoginWrapper}
          options={{
            headerTitle: "Cryptonite",
            headerBackTitleVisible: false,
            headerLeft: () => null,
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        {/* Register */}
        <Stack.Screen
          name="Register"
          component={RegisterWrapper}
          options={{
            headerTitle: "Cryptonite",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        {/* Email Pending (Doğrulama Bekleme) */}
        <Stack.Screen
          name="VerifyEmailPending"
          component={VerifyEmailPendingWrapper}
          options={{
            headerTitle: "Email Doğrulama",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        {/* Kod Doğrulama (başka işler için saklıyoruz) */}
        <Stack.Screen
          name="VerifyCode"
          component={VerifyCodeWrapper}
          options={{
            headerTitle: "Kod Doğrulama",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        {/* Şifremi Unuttum */}
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordWrapper}
          options={{
            headerTitle: "Şifremi Unuttum",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        {/* Şifre Değiştir */}
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordWrapper}
          options={{
            headerTitle: "Şifre Değiştir",
            headerRight: getHeaderRight(isDark, toggleTheme),
          }}
        />

        {/* Vault */}
        <Stack.Screen
          name="Vault"
          component={VaultWrapper}
          options={({ navigation }) => getVaultHeaderOptions(isDark, toggleTheme, navigation)}
        />

        {/* Settings */}
        <Stack.Screen
          name="Settings"
          component={SettingsWrapper}
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
  themeButton: { marginRight: 15 },
  themeIcon: { width: iconSize + 4, height: iconSize + 4, resizeMode: "contain" },
  settingsButton: { marginLeft: 15 },
  settingsIcon: { width: iconSize + 4, height: iconSize + 4, resizeMode: "contain" },
});
