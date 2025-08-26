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
    background: "#ffffff",   // arka plan
    primary: "#4CAF50",      // ana vurgu rengi (yeşil)
    text: "#000000",         // yazılar
    card: "#f9f9f9",         // header / kart arkaplan
    border: "#ddd",          // input ve çerçeveler

    // Buton renkleri
    button: {
      primary: "#4CAF50",    // yeşil
      danger: "#E53935",     // kırmızı
      warning: "#FF9800",    // turuncu
    },
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
    background: "#000000",   // arka plan
    primary: "#39FF14",      // ana vurgu rengi (neon yeşil)
    text: "#ffffff",         // yazılar
    card: "#1e1e1e",         // header / kart arkaplan
    border: "#333",          // input ve çerçeveler

    // Neon buton renkleri
    button: {
      primary: "#39FF14",    // neon yeşil
      danger: "#FF073A",     // neon kırmızı
      warning: "#FF6700",    // neon turuncu
    },
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "bold" },
  },
};
