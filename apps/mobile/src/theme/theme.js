import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const lightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#fff",
    primary: "green",
    text: "#000",
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "bold" },
  },
};

export const darkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#000",
    primary: "green",
    text: "#fff",
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "bold" },
  },
};
