import React, { createContext, useState, useContext } from "react";
import { lightTheme, darkTheme } from "./theme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🔹 Custom hook: artık direkt useThemeContext() çağırabilirsin
export const useThemeContext = () => useContext(ThemeContext);
