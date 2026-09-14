import { ChatSearchResults } from 'app/components2/organisms/chat/chat-search-results/component';
import { RoomsSubcribed } from 'app/components2/organisms/chat/rooms-subscribed-list';
import { View } from 'react-native';

export const ChatScreen = () => {
  return (
    <View className="flex-col gap-4 flex-1">
      <ChatSearchResults />
      <RoomsSubcribed />
    </View>
  );
};
