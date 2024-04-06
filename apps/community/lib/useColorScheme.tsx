import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { theme } from "tailwind-theme/src/colors"

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
    colors: theme[colorScheme ?? "light"],
    palette: theme
  };
}
