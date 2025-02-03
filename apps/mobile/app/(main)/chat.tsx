import {
  ChatScreen as ChatScreenBase,
  ChatScreenHeader,
} from 'app/screens/chat';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <ChatScreenHeader />,
      headerShown: true,
    });
  }, [navigation]);
  return (
    <View className="flex-1">
      <ChatScreenBase />
    </View>
  );
}

export default function ChatScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={ChatScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
