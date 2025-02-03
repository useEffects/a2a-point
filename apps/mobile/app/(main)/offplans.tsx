import { Header } from 'app/components/header';
import {
  OffPlansScreen as OffPlansScreenBase,
  OffplansScreenHeader,
} from 'app/screens/offplans';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'app/components/ui/text';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function OffPlansScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <OffplansScreenHeader />,
    });
  }, [navigation]);
  return (
    <View className="flex-1">
      <OffPlansScreenBase />
    </View>
  );
}

export default function OffPlansScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Off plans"
        component={OffPlansScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
