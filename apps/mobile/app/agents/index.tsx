import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMediumUsersQuery } from 'app/components/cards/utils/users';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  UsersListScreen as UsersListScreenBase,
  UsersListScreenHeader,
} from 'app/screens/users-list';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export function AgentsListScreenComponent() {
  const { data } = useMediumUsersQuery();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <UsersListScreenHeader />,
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <UsersListScreenBase data={data} />
    </View>
  );
}

export default function AgentsListScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Agents"
        component={AgentsListScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
