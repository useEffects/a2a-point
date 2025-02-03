import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  MembershipApplyScreen as MembershipApplyScreenBase,
  MembershipApplyScreenHeader,
} from 'app/screens/account-console/membership-apply';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function MembershipScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <MembershipApplyScreenHeader />,
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <MembershipApplyScreenBase />
    </ScrollView>
  );
}

export default function MembershipScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Membership"
        component={MembershipScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
