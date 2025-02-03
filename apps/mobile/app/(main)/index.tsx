import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeScreen as HomeScreenBase,
  HomeScreenHeader,
} from 'app/screens/home';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Header } from 'app/components/header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Text } from 'app/components/ui/text';

const Stack = createNativeStackNavigator();

function HomeScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <HomeScreenHeader />,
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 bg-background pt-8">
      <HomeScreenBase />
    </ScrollView>
  );
}

export default function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
