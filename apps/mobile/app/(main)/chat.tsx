import { ChatScreen as ChatScreenBase } from 'app/screens/chat';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex-1" style={{ paddingTop: top }}>
      <ChatScreenBase />
    </View>
  );
}
