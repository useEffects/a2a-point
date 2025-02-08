import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  PhoneVerificationScreen as PhoneVerificationScreenBase,
  PhoneVerificationScreenHeader,
} from 'app/screens/account-console/phone';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function PhoneVerificationScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <PhoneVerificationScreenHeader />,
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <PhoneVerificationScreenBase />
    </ScrollView>
  );
}

export default function PhoneVerificationScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Phone"
        component={PhoneVerificationScreenComponent}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
}
