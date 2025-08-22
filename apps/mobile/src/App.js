import React from "react";
import { useColorScheme } from "react-native"; 
import AppNavigator from "./navigation/AppNavigator";
import { lightTheme, darkTheme } from "./theme/theme";

export default function App() {
  const colorScheme = useColorScheme(); 
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return <AppNavigator theme={theme} />;
}
