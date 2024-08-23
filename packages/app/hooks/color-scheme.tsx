import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { theme } from "tailwind-theme/src/colors"
import { useTheme } from "next-themes"
import { Platform } from "react-native";
import { useMemo } from "react";

export type ColorSchemeContextType = {
  colorScheme: "dark" | "light";
  isDarkColorScheme: boolean;
  setColorScheme: (colorScheme: "dark" | "light") => void;
  toggleColorScheme: () => void;
  colors: typeof theme["light" | "dark"];
  palette: typeof theme;
}

export function useColorScheme(): ColorSchemeContextType {
  const nativeColorScheme = useNativewindColorScheme();
  const webColorScheme = useTheme();

  const isWeb = Platform.OS === "web";

  return useMemo(() => {
    if (isWeb) {
      const themeMode = webColorScheme.theme ?? "dark";
      return {
        colorScheme: themeMode === "light" ? "light" : "dark",
        isDarkColorScheme: themeMode === "dark",
        setColorScheme: (themeMode: "light" | "dark") => webColorScheme,
        toggleColorScheme: () => webColorScheme.setTheme(themeMode === "light" ? "dark" : "light"),
        colors: themeMode === "light" ? theme.light : theme.dark,
        palette: theme
      } as ColorSchemeContextType;
    } else {
      const themeMode = nativeColorScheme.colorScheme ?? "dark";
      return {
        colorScheme: themeMode === "light" ? "light" : "dark",
        isDarkColorScheme: themeMode === "dark",
        setColorScheme: nativeColorScheme.setColorScheme,
        toggleColorScheme: nativeColorScheme.toggleColorScheme,
        colors: themeMode === "light" ? theme.light : theme.dark,
        palette: theme
      } as ColorSchemeContextType;
    }
  }, [isWeb, nativeColorScheme, webColorScheme]);
}