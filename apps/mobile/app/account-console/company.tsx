import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  CompanySelectScreen as CompanySelectScreenBase,
  CompanySelectScreenHeader,
} from 'app/screens/account-console/company-select';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function CompanySelectScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <CompanySelectScreenHeader />,
    });
  }, []);
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <CompanySelectScreenBase />
    </ScrollView>
  );
}

export default function CompanySelectScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Company Select"
        component={CompanySelectScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
