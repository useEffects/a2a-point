import {
  deleteNotification,
  readNotifications,
  updateNotification,
} from '@directus/sdk';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'app/components/utils/virtual-lists';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { directusStore } from 'app/store/directus';
import { Notification } from 'app/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'app/components/ui/dropdown-menu';
import { Separator } from 'app/components/ui/separator';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useUserDetails } from 'app/hooks/user-details';
import { UserChip } from 'app/components/user-chip';
import { queryClient, queryStore } from 'app/store/query';
import { EllipsisVertical } from 'lucide-react-native';
import { timeAgo } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { BackButton, Header, HeaderTitle } from '../../components/header';
import { useQueryClient } from '@tanstack/react-query';
import InfiniteList from '../../components/infinite';
import { notificationsQuery } from './queries';

const fetchNotificationsQueryKey = ['Fetching Notifications'];

const NotificationDropdown = (
  props: Notification & {
    setNotifications: Dispatch<SetStateAction<Notification[]>>;
  },
) => {
  const [open, setOpen] = useState(false);
  const { rest } = directusStore();
  const { colors } = useColorScheme();
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await rest.request(
      updateNotification(props.id.toString(), {
        status: 'archived',
      }),
    );
    props.setNotifications((notifications) =>
      notifications.filter((n) => n.id !== props.id),
    );
    queryClient.setQueryData(
      fetchNotificationsQueryKey,
      (notifications: Notification[]) =>
        notifications.filter((n) => n.id !== props.id),
    );
    setOpen(false);
  };

  const handleDelete = async () => {
    await rest.request(deleteNotification(props.id.toString()));
    props.setNotifications((notifications) =>
      notifications.filter((n) => n.id !== props.id),
    );
    queryClient.setQueryData(
      fetchNotificationsQueryKey,
      (notifications: Notification[]) =>
        notifications.filter((n) => n.id !== props.id),
    );
    setOpen(false);
  };

  return (
    <DropdownMenu onOpenChange={(v) => setOpen(v)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'base'}
          size={'none'}
          onPress={() => setOpen((p) => !p)}
        >
          <EllipsisVertical size={14} color={colors.foreground} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent insets={{ top: 40 }}>
        <DropdownMenuItem>
          <Text onPress={handleUpdate} className="!text-sm">
            Mark as read
          </Text>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Text onPress={handleDelete} className="!text-sm">
            Delete Notification
          </Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const RenderNotifications = (
  props: Notification & {
    setNotifications: Dispatch<SetStateAction<Notification[]>>;
  },
) => {
  const { colors } = useColorScheme();
  const senderDetails = useUserDetails(props.sender);

  let borderLeftColor;
  if (props.collection === 'directus_users') borderLeftColor = colors.info;
  if (props.collection === 'listings') borderLeftColor = colors.success;

  return (
    <View
      style={{ borderLeftWidth: 4, borderLeftColor }}
      className="gap-1 px-2 py-4 border-solid border-0 flex-col"
    >
      <View className="flex-row justify-between items-center">
        {senderDetails ? <UserChip user={senderDetails} /> : <View />}
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-subtext">
            {timeAgo.format(new Date(props.timestamp))}
          </Text>
          <NotificationDropdown {...props} />
        </View>
      </View>
      <View className="flex-col">
        <Text>{props.subject}</Text>
        <Text className="text-sm text-subtext">{props.message}</Text>
      </View>
    </View>
  );
};

export function NotificationsListScreen() {
  const { rest } = directusStore();
  const { user } = userStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationsQueryOptions = notificationsQuery();

  return (
    <View className="flex-1">
      <InfiniteList<Notification>
        component={(item: Notification) => (
          <RenderNotifications {...item} setNotifications={setNotifications} />
        )}
        skeletonComponent={() => <></>}
        infiniteQueryOptions={notificationsQueryOptions}
        flatListProps={{
          scrollEnabled: false,
        }}
        infinite
      />
    </View>
  );
}

export function NotificationsListScreenHeader() {
  return (
    <Header>
      <View className="flex-row items-center">
        <BackButton />
        <HeaderTitle>Notifications</HeaderTitle>
      </View>
    </Header>
  );
}
