// navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, Image } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VaultScreen from "../screens/VaultScreen";
import SettingsScreen from "../screens/SettingsScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";  // ✅ SMS doğrulama ekranı

import { useThemeContext } from "../theme/ThemeContext";  
import { iconSize } from "../theme/theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme, isDark, toggleTheme } = useThemeContext();

  const ThemeToggleButton = () => (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Image
        source={
          isDark
            ? require("../assets/icons/moon.png")
            : require("../assets/icons/sun.png")
        }
        style={{ width: iconSize + 4, height: iconSize + 4, resizeMode: "contain" }}
      />
    </TouchableOpacity>
  );

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: "Cryptonite",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "green" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "normal", fontSize: 20 },
        }}
      >
        <Stack.Screen
          name="Login"
          options={{
            headerRight: () => <ThemeToggleButton />,
          }}
        >
          {(props) => <LoginScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen
          name="Register"
          options={{
            headerRight: () => <ThemeToggleButton />,
          }}
        >
          {(props) => <RegisterScreen {...props} theme={theme} />}
        </Stack.Screen>

        {/* ✅ SMS doğrulama ekranı */}
        <Stack.Screen
          name="VerifyCode"
          options={{
            headerTitle: "SMS Doğrulama",
            headerTitleAlign: "center",
            headerRight: () => <ThemeToggleButton />, // ✅ sağ üst tema butonu
          }}
        >
          {(props) => <VerifyCodeScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen
          name="Vault"
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.navigate("Settings")}
              >
                <Image
                  source={require("../assets/icons/settings.png")}
                  style={{ width: iconSize + 4, height: iconSize + 4, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            ),
            headerRight: () => <ThemeToggleButton />,
          })}
        >
          {(props) => <VaultScreen {...props} theme={theme} />}
        </Stack.Screen>

        <Stack.Screen
          name="Settings"
          options={{
            headerRight: () => <ThemeToggleButton />,
          }}
        >
          {(props) => <SettingsScreen {...props} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
