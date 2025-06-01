import { AsyncImage } from 'app/components/async-image';
import { buildAssetUrl } from 'app/lib/helpers';
import { User } from 'app/lib/types';
import { View } from 'react-native';

export const profileDetailsHeight = 200;

export const ProfileDetails = ({ user }: { user: User }) => {
  return (
    <View
      className="flex-col w-full gap-4 items-center px-4"
      style={{ height: profileDetailsHeight }}
    >
      <AsyncImage
        source={{ uri: buildAssetUrl(user.avatar) }}
        className="w-32 h-32 rounded-full border border-solid border-border"
      />
    </View>
  );
};
