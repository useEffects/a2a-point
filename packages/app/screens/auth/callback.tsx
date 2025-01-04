import { useEffect } from 'react';
import { View } from 'react-native';
import { useRootNavigationState, useRouter } from 'app/context/router';
import { Redirect } from 'expo-router';

export const AuthCallbackScreen = ({
  redirect = '/',
}: {
  redirect?: string;
}) => {
  const rootNavigationState = useRootNavigationState();
  return rootNavigationState.key ? <Redirect href={redirect} /> : <View></View>;
};
