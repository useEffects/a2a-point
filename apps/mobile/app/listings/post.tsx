import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  PostScreen as PostScreenBase,
  PostScreenHeader,
} from 'app/screens/post';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function PostScreenComponent() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <PostScreenHeader />,
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <PostScreenBase />
    </ScrollView>
  );
}

export default function PostScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Post"
        component={PostScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
