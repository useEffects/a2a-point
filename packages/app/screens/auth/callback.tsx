import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export const AuthCallbackScreen = ({ redirect = '/' }: { redirect?: string }) => {
  useEffect(() => {
    router.navigate(redirect);
  }, []);
  return <View></View>;
};
