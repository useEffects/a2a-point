import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  LoginScreen as LoginScreenBase,
  LoginScreenHeader,
} from 'app/screens/auth/login';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

function LoginScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <LoginScreenHeader />,
    });
  }, [navigation]);
  return (
    <ScrollView className='flex-1'>
      <LoginScreenBase />
    </ScrollView>
  );
}

export default function LoginScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={LoginScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
