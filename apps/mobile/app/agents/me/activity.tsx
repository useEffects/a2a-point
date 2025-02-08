import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  ActivityScreen as ActivityScreenBase,
  ActivityScreenHeader,
} from 'app/screens/activity';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function ActivityScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <ActivityScreenHeader />,
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <ActivityScreenBase />
    </View>
  );
}

export default function ActivityScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activities"
        component={ActivityScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
