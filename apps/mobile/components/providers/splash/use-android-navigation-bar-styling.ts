import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as navigationBar from 'expo-navigation-bar';
import { useColorScheme } from 'app/hooks/color-scheme';

export function useAndroidNavigationBarStyling() {
  const { colorScheme, colors } = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      navigationBar.setBackgroundColorAsync(colors.accent);
      navigationBar.setButtonStyleAsync(
        colorScheme === 'dark' ? 'light' : 'dark',
      );
    }
  }, [colors, colorScheme]);
}
