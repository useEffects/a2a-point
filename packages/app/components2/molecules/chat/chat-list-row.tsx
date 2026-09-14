import { useChat } from 'app/application/chat/hooks/useChat';
import { RoomSubscribed } from 'app/application/chat/types';
import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { buildAssetUrl, timeAgo } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { View } from 'react-native';

export const ChatListRow = (room: RoomSubscribed) => {
  const { user } = userStore();
  const router = useRouter();
  const {
    chatQueryData: { data: messagesData, isPending },
  } = useChat(room.id);

  const lastMessage = messagesData.pages[0]?.[0];

  const isGroup = room.type === 'group';
  const isUserSender = lastMessage?.user_created.id === user?.id;

  // Determine how the last message content should be shown
  let lastMessageContent = '';

  if (lastMessage?.content.trim()) {
    lastMessageContent = lastMessage?.content.trim();
  } else if (lastMessage?.assets?.[0]?.name) {
    lastMessageContent = `Attachment: ${lastMessage?.assets?.[0]?.name}`;
  }

  if (lastMessageContent) {
    if (isUserSender) {
      lastMessageContent = `You: ${lastMessageContent}`;
    } else if (isGroup && lastMessage) {
      lastMessageContent = `${lastMessage.user_created.first_name}: ${lastMessageContent}`;
    }
  }

  // Determine chat display name and avatar
  const otherMember = room.members.find(
    (member) => member.directus_users_id.id !== user?.id,
  );

  const [displayName, avatarUrl] = isGroup
    ? [room.title, buildAssetUrl(room.avatar)]
    : [
        `${otherMember?.directus_users_id.first_name} ${otherMember?.directus_users_id.last_name}`,
        buildAssetUrl(otherMember?.directus_users_id.avatar),
      ];

  if (isPending) return <ChatListRowSkeleton />;

  return (
    <Button
      onPress={() => router.push(`/chat/${room.id}`)}
      variant="ghost"
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: avatarUrl }}
      />

      <View className="flex-1 justify-center">
        <View className="flex-row justify-between items-center">
          <Text className="!text-base">{displayName}</Text>
          {lastMessage ? (
            <Text className="!text-sm text-subtext">
              {timeAgo.format(new Date(lastMessage!.date_created))}
            </Text>
          ) : (
            <></>
          )}
        </View>

        <Text className="!text-sm text-subtext !font-normal">
          {lastMessageContent}
        </Text>
      </View>
    </Button>
  );
};

export const ChatListRowSkeleton = () => {
  return (
    <View className="h-20 gap-4 flex-row items-center w-full justify-start">
      <Skeleton className="w-12 h-12 rounded-full" />
      <View className="flex-1 justify-center">
        <View className="flex-row justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-12" />
        </View>
        <Skeleton className="h-3 w-3/4" />
      </View>
    </View>
  );
};
