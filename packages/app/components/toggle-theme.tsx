import { useColorScheme } from 'app/hooks/color-scheme';
import { MoonStar, Sun } from 'lucide-react-native';
import { Platform } from 'react-native';
import { Button } from './ui/button';
import { storage } from 'app/lib/mmkv';

export function ToggleTheme() {
  const { colors, isDarkColorScheme, toggleColorScheme, setColorScheme } =
    useColorScheme();

  const onPress = toggleColorScheme;

  return (
    <Button
      variant="ghost"
      size={'icon'}
      onPress={onPress}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
    >
      {isDarkColorScheme ? (
        <MoonStar color={colors.foreground} size={24} />
      ) : (
        <Sun color={colors.foreground} size={24} />
      )}
    </Button>
  );
}
