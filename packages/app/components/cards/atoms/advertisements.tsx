import { Image, Pressable, View } from 'react-native';
import { Advertisement, User } from 'app/lib/types';
import { Text } from 'app/components/ui/text';
import {
  buildAssetUrl,
  getDMRoomId,
  shortTime,
  timeAgo,
} from 'app/lib/helpers';
import userStore from 'app/store/user';
import { UserChip } from 'app/components/user-chip';
import * as Linking from 'expo-linking';
import { AsyncImage } from 'app/components/async-image';

export type AdvertisementCardProps = Pick<
  Advertisement,
  'id' | 'caption' | 'title' | 'photo' | 'date_created' | 'link_to_open'
> & {
  user_created: Pick<
    User,
    'id' | 'first_name' | 'last_name' | 'email' | 'avatar' | 'plan'
  >;
};

export const AdvertisementCard = (props: AdvertisementCardProps) => {
  const { user } = userStore();

  return (
    <Pressable
      onPress={async () =>
        props.link_to_open &&
        (await Linking.canOpenURL(props.link_to_open)) &&
        Linking.openURL(props.link_to_open)
      }
      className="flex-col gap-4 bg-card py-6"
    >
      <View className="flex-row justify-between items-center px-4">
        <UserChip user={props.user_created} />
        <Text className="text-xs text-subtext">Promoted</Text>
      </View>
      <Text className="text-lg px-4">{props.title}</Text>
      <AsyncImage
        source={{ uri: buildAssetUrl(props.photo) }}
        className="w-full aspect-video"
      />
      <Text className="text-sm px-4">{props.caption}</Text>
      <Text className="text-xs text-subtext px-4">
        {timeAgo.format(new Date(props.date_created))}
      </Text>
    </Pressable>
  );
};
