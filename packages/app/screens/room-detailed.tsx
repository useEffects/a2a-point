import { readItem, readItems } from '@directus/sdk';
import { useQuery } from '@tanstack/react-query';
import { ChatUi, CurrentMessage } from 'app/components/chat-ui';
import { Header } from 'app/components/header';
import { ChevronDown, ChevronUp, Search, X } from 'app/components/icons';
import SearchBar from 'app/components/searchbar';
import { Button, ButtonProps } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { Member, RoomSubscribed } from 'app/context/chats';
import { useChats } from 'app/hooks/chats';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import { randomUUID } from 'expo-crypto';
import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { useDebounce } from 'use-debounce';

const ChatScreen = ({
  roomDetails,
  receivers,
}: {
  roomDetails: {
    roomName: string;
    roomAvatar: string;
    roomId: string;
    isGroup: boolean;
  };
  receivers: Member[];
}) => {
  const router = useRouter();

  const { roomName, roomAvatar, roomId, isGroup } = roomDetails;
  const { messages, setMessage, loadMoreMessages } = useChats();
  const { rest } = directusStore();
  const { user } = userStore();
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [scrollToIndex, setScrollToIndex] = useState<number>(0);
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [currentMessage, setCurrentMessage] = useState<CurrentMessage>({
    text: '',
  });
  const [offset, setOffset] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const GoToButton = (props: ButtonProps) =>
    isGroup ? (
      <Button onPress={() => router.push(`/locations/${roomId}`)} {...props} />
    ) : (
      <Button
        onPress={() =>
          router.push(`agents/${receivers[0]!.directus_users_id.id}`)
        }
        {...props}
      />
    );

  const { data: scrollToMessages, isLoading: isScrollToMessagesLoading } =
    useQuery({
      queryKey: ['Search Messages', debouncedSearchText, roomId],
      queryFn: async () =>
        await rest.request(
          readItems('messages', {
            filter: {
              room: {
                _eq: roomId,
              },
            },
            fields: ['id'],
            search: debouncedSearchText,
            sort: ['-date_created'],
          }),
        ),
      enabled: !!debouncedSearchText && debouncedSearchText.length > 2,
      initialData: [],
    }) as { data: { id: string }[]; isLoading: boolean };

  const handleSend = () => {
    if (
      !currentMessage.text &&
      !(currentMessage.assets && currentMessage.assets.length)
    )
      return;
    setMessage({
      id: randomUUID(),
      content: currentMessage.text,
      room: roomId,
      user_created: user!,
      date_created: new Date().toISOString(),
      sent: false,
      assets: currentMessage.assets?.length ? currentMessage.assets : undefined,
    });
    setCurrentMessage({ text: '' });
  };

  const handleEndReached = async () => {
    if (isScrollToMessagesLoading || endReached) return;
    const isAdded = await loadMoreMessages(offset, roomId);
    setOffset((p) => p + 1);
    if (!isAdded) setEndReached(true);
  };

  return (
    <View className="flex-col flex-1">
      <Header className="w-full">
        {searchBarVisible ? (
          <View className="flex-row items-center justify-between flex-1 gap-4">
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              searchBarProps={{
                showLoading: isScrollToMessagesLoading,
              }}
            />
            <View className="flex-row items-center">
              {scrollToMessages && scrollToMessages.length ? (
                <View className="flex-row items-center">
                  <Text>
                    {scrollToIndex + 1} / {scrollToMessages.length}
                  </Text>
                  <View className="flex-row">
                    <Button
                      disabled={scrollToIndex === scrollToMessages.length - 1}
                      className="mx-0"
                      onPress={() =>
                        scrollToIndex < scrollToMessages.length - 1 &&
                        setScrollToIndex((p) => p + 1)
                      }
                      variant={'ghost'}
                      size={'icon'}
                    >
                      <ChevronUp size={18} className="!text-foreground" />
                    </Button>
                    <Button
                      disabled={scrollToIndex === 0}
                      className="mx-0"
                      variant={'ghost'}
                      size={'icon'}
                      onPress={() =>
                        scrollToIndex > 0 && setScrollToIndex((p) => p - 1)
                      }
                    >
                      <ChevronDown size={18} className="!text-foreground" />
                    </Button>
                  </View>
                </View>
              ) : (
                <></>
              )}
              <Button
                variant={'ghost'}
                size={'icon'}
                onPress={() => {
                  setSearchBarVisible(false);
                  setSearchText('');
                }}
              >
                <X size={18} className="!text-foreground" />
              </Button>
            </View>
          </View>
        ) : (
          <View className="flex-row justify-between items-center flex-1">
            <GoToButton variant={'base'} size={'none'}>
              <View className="flex-row items-center gap-2">
                <Image
                  source={{ uri: roomAvatar }}
                  className="w-8 h-8 rounded-full"
                />
                <Text>{roomName}</Text>
              </View>
            </GoToButton>
            <View className="flex-row items-center gap-2">
              <Button
                variant={'ghost'}
                size={'icon'}
                onPress={() => setSearchBarVisible(true)}
              >
                <Search size={18} className="!text-foreground" />
              </Button>
              {/* <ChatDropDownMenu roomId={roomId} members={receivers} isGroup={isGroup} open={openDropdown} setOpen={setOpenDropdown} /> */}
            </View>
          </View>
        )}
      </Header>
      <ChatUi
        currentUserId={user?.id!}
        messages={messages.filter((m) => m.room === roomId)}
        goToId={scrollToMessages[scrollToIndex]?.id}
        currentMessage={currentMessage}
        currentMessageDispatcher={setCurrentMessage}
        onSend={handleSend}
        isGroup={isGroup}
        listProps={{
          onEndReachedThreshold: 0,
          onEndReached: handleEndReached,
          className: 'flex-1',
        }}
        receivers={receivers}
      />
    </View>
  );
};

export default function RoomDetailedComponent({ roomId }: { roomId: string }) {
  const { user } = userStore();
  const { roomsSubscribed, addRoom } = useChats();
  const [room, setRoom] = useState<RoomSubscribed | null | undefined>();
  const [roomDetails, setRoomDetails] = useState<{
    roomId: string;
    roomName: string;
    roomAvatar: string;
    isGroup: boolean;
  }>();
  const [receivers, setReceivers] = useState<Member[] | undefined>();
  const { rest } = directusStore();

  useEffect(() => {
    async function init() {
      if (!roomId) {
        setRoomDetails(undefined);
      } else {
        const found = roomsSubscribed.find((r) => r.id === roomId);
        if (found) {
          setRoom(found);
        } else {
          const checkRoom = await rest.request(
            readItem('rooms', roomId, {
              fields: ['id'],
            }),
          );
          if (checkRoom && checkRoom.id) {
            const _room = await addRoom(roomId);
            setRoom(_room);
          }
        }
      }
    }
    init();
  }, [addRoom, roomId, roomsSubscribed]);

  useEffect(() => {
    const _receivers = room?.members.filter(
      (m) => m.directus_users_id.id !== user?.id,
    );
    if (roomId && _receivers) {
      const [roomName, roomAvatar] =
        room?.type === 'group'
          ? [room?.title!, buildAssetUrl(room?.avatar)]
          : [
              `${_receivers[0]!.directus_users_id.first_name} ${_receivers[0]!.directus_users_id.last_name}`,
              buildAssetUrl(_receivers[0]!.directus_users_id.avatar),
            ];
      roomAvatar.then((rm) =>
        setRoomDetails({
          roomId: roomId as string,
          roomName,
          roomAvatar: rm,
          isGroup: room?.type === 'group',
        }),
      );
    }
    setReceivers(_receivers);
  }, [room, roomId, user?.id]);

  if (room === undefined) {
    return null;
  }

  return roomDetails && receivers ? (
    <ChatScreen roomDetails={roomDetails} receivers={receivers} />
  ) : (
    <></>
  );
}

// const ChatDropDownMenu = (props: { members: Member[], isGroup: boolean, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, roomId: string }) => {

//     const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

//     return <View>
//         <DropdownMenu open={props.open} onOpenChange={props.setOpen}>
//             <DropdownMenuTrigger asChild>
//                 <Button variant={"ghost"} size={"icon"} onPress={() => props.setOpen(p => !p)}>
//                     {props.open ? <X size={18} className="!text-foreground" /> : <EllipsisVertical size={18} className="!text-foreground" />}
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent sideOffset={-40}>
//                 {props.isGroup ? (
//                     <Button
//                         onPress={() => setBottomSheetVisible(true)}
//                         className="!justify-start !w-full !items-start !flex !flex-row"
//                     >
//                         <Text className="!text-sm">See members</Text>
//                     </Button>
//                 ) : (
//                     <GoToProfileButton
//                         additionalOnPress={() => props.setOpen(false)}
//                         userId={props.members[0]!.directus_users_id.id}
//                         variant={"ghost"}
//                         size={"default"}
//                         className="!justify-start !w-full !items-start !flex !flex-row"
//                     >
//                         <Text className="!text-sm !text-left">See profile</Text>
//                     </GoToProfileButton>
//                 )}
//                 {props.isGroup && (
//                     <GoToLocationListingsButton
//                         roomId={props.roomId}
//                         variant={"base"}
//                         size={"none"}
//                         className="justify-start w-full"
//                     >
//                         <DropdownMenuItem className="w-full">
//                             <Text className="!text-sm">Browse listings</Text>
//                         </DropdownMenuItem>
//                     </GoToLocationListingsButton>
//                 )}
//                 <Button variant={"ghost"} className="!justify-start !w-full !items-start flex flex-row">
//                     <Text className="!text-sm !text-left">Mute notifications</Text>
//                 </Button>
//             </DropdownMenuContent>
//         </DropdownMenu>
//         <BottomSheet isVisible={bottomSheetVisible} onBackdropPress={() => setBottomSheetVisible(false)}>
//             <View className="bg-card flex-col gap-4 py-4">
//                 <View className="flex-row justify-between px-4">
//                     <Text>Members</Text>
//                     <Button onPress={() => setBottomSheetVisible(false)} variant={"destructive"} size={"icon"} className="w-6 h-6">
//                         {/* <Ionicons name="close-outline" size={18} className="!text-destructive-foreground" /> */}
//                     </Button>
//                 </View>
//                 <ScrollView className="flex-col gap-4">
//                     {props.members.map((member, index) => <GoToProfileButton userId={member.directus_users_id.id} variant={"ghost"} key={index} className="flex-row items-center justify-start gap-2 native:!px-4 px-4">
//                         <Image source={{ uri: buildAssetUrl(member.directus_users_id.avatar) }} className="w-8 h-8 rounded-full" />
//                         <Text>{member.directus_users_id.first_name} {member.directus_users_id.last_name}</Text>
//                     </GoToProfileButton>)}
//                 </ScrollView>
//             </View>
//         </BottomSheet>
//     </View>
// }
