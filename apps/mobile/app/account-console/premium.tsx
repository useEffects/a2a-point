import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  PremiumCreditsScreen as PremiumCreditsScreenBase,
  PremiumCreditsScreenHeader,
} from 'app/screens/account-console/premium-credits';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function PremiumCreditsScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <PremiumCreditsScreenHeader />,
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <PremiumCreditsScreenBase />
    </ScrollView>
  );
}

export default function PremiumCreditsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Premium Credits"
        component={PremiumCreditsScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
