import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  VerificationApplyScreen as VerificationApplyScreenBase,
  VerificationApplyScreenHeader,
} from 'app/screens/account-console/verification-apply';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function VerificationScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <VerificationApplyScreenHeader />,
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <VerificationApplyScreenBase />
    </ScrollView>
  );
}

export default function VerificationScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Verification"
        component={VerificationScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
