import { useColorScheme as useNativewindColorScheme } from "nativewind";
import shadcnTheme from "assets/shadcn-theme.json"

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
    colors: shadcnTheme[colorScheme ?? "light"],
    palette: shadcnTheme
  };
}
