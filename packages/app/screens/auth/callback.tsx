import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'app/context/router';

export const AuthCallbackScreen = ({
  redirect = '/',
}: {
  redirect?: string;
}) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirect);
  }, []);

  return <View />;
};
