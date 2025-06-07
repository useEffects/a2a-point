import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { directusUrl } from 'app/lib/constants';
import { timeAgo } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { Link } from 'expo-router';
import { View } from 'react-native';
import * as Linking from 'expo-linking';
import { User } from 'app/lib/types';

export const ProfileLabels = ({ user }: { user: User }) => {
  const { user: currentUser } = userStore();
  const router = useRouter();

  return (
    <View className="flex-col items-center justify-between w-full gap-4">
      <View className="flex-col gap-2 items-center">
        <Text className="text-secondary font-semibold">
          {user.first_name} {user.last_name}
        </Text>
        {user.email ? (
          <Link href={`mailto:${user.email}`}>
            <Text className="text-info underline">{user.email}</Text>
          </Link>
        ) : (
          <></>
        )}
        {user.phone ? (
          <Link href={`phoneto:${user.phone}`}>
            <Text className="text-info underline">{user.phone}</Text>
          </Link>
        ) : (
          <>s</>
        )}
        {user.location ? <Text>{user.location}</Text> : <></>}
        {user.title ? (
          <Text className="text-subtext">{user.title}</Text>
        ) : (
          <> </>
        )}
        <View className="flex-row w-full justify-evenly">
          <View className="flex-col items-center flex-1">
            <Text>100</Text>
            <Text className="text-subtext">Listings</Text>
          </View>
          <View className="flex-col items-center flex-1">
            <Text>{user.computed_rating ?? '-'}</Text>
            <Text className="text-subtext">Rating</Text>
          </View>
          {/* <View className="flex-col items-center flex-1">
            <Text>{timeAgo.format(new Date(user.last_access))}</Text>
            <Text className="text-subtext">Last Seen</Text>
          </View> */}
        </View>
      </View>
      <View className="flex-row w-full justify-between px-4 gap-4">
        <Button
          onPress={() =>
            Linking.openURL(`${directusUrl}/admin/users/${user.id}`)
          }
          size="sm"
          className="flex-1"
        >
          <Text>Dashboard</Text>
        </Button>
        {user.id === currentUser.id ? (
          <Button
            onPress={() => router.push('/agents/me/activity')}
            variant={'default'}
            size="sm"
            className="flex-1"
          >
            <Text>Your activity</Text>
          </Button>
        ) : (
          <Button
            onPress={() => router.push(`/agents/feedbacks/${user.id}`)}
            size={'sm'}
            variant={'default'}
            className="flex-1"
          >
            <Text>Give feedback</Text>
          </Button>
        )}
      </View>
    </View>
  );
};
