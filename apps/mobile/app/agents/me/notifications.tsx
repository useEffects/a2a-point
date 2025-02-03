import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NotificationsListScreen as NotificationsListScreenBase,
  NotificationsListScreenHeader,
} from 'app/components/notifications';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function NotificationsListScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <NotificationsListScreenHeader />,
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <NotificationsListScreenBase />
    </View>
  );
}

export default function NotificationsListScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activities"
        component={NotificationsListScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
