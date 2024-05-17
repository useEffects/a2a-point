import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { theme } from "tailwind-theme/src/colors"
import { useTheme } from "next-themes"
import { Platform } from "react-native";
import { useMemo } from "react";

export type ColorSchemeContextType = {
  colorScheme: "dark" | "light" | null;
  isDarkColorScheme: boolean;
  setColorScheme: (colorScheme: "dark" | "light") => void;
  toggleColorScheme: () => void;
  colors: typeof theme["light" | "dark"];
  palette: typeof theme;
}

export function useColorScheme(): ColorSchemeContextType {
  const nativeColorScheme = useNativewindColorScheme();
  const webColorScheme = useTheme()

  return Platform.OS === "web" ? useMemo(() => ({
    colorScheme: webColorScheme.theme ?? "dark",
    isDarkColorScheme: webColorScheme.theme === "dark",
    setColorScheme: (themeMode: "light" | "dark") => webColorScheme.setTheme(themeMode),
    toggleColorScheme: () => webColorScheme.setTheme(webColorScheme.theme === "light" ? "dark" : "light"),
    colors: webColorScheme.theme === "light" ? theme.light : theme.dark,
    palette: theme
  } as ColorSchemeContextType), [webColorScheme]) 

  : {
    colorScheme: nativeColorScheme.colorScheme ?? "dark",
    isDarkColorScheme: nativeColorScheme.colorScheme === "dark",
    setColorScheme: nativeColorScheme.setColorScheme,
    toggleColorScheme: nativeColorScheme.toggleColorScheme,
    colors: nativeColorScheme.colorScheme === "light" ? theme.light : theme.dark,
    palette: theme
  };
}