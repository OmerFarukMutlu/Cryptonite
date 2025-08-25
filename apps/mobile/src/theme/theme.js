import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";

// 🔹 Ortak ikon boyutu (tüm ikonlarda kullanılacak)
export const iconSize = 28;

// 🔹 Açık tema
export const lightTheme = {
  ...NavigationDefaultTheme,
  dark: false,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#ffffff", // arka plan
    primary: "green",      // ana vurgu rengi
    text: "#000000",       // yazılar
    card: "#f9f9f9",       // header / kart arkaplan
    border: "#ddd",        // input ve çerçeveler
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "bold" },
  },
};

// 🔹 Koyu tema
export const darkTheme = {
  ...NavigationDarkTheme,
  dark: true,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#000000", // arka plan
    primary: "green",      // ana vurgu rengi
    text: "#ffffff",       // yazılar
    card: "#1e1e1e",       // header / kart arkaplan
    border: "#333",        // input ve çerçeveler
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "bold" },
  },
};
