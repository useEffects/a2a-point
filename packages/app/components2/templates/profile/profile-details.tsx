import { User } from 'app/lib/types';
import { View } from 'react-native';
import { ProfilePic } from '../../organisms/profile/profile-pic';
import { ProfileLabels } from 'app/components2/organisms/profile/profile-labels';

export const profileDetailsHeight = 32 * 4 + 8 * 1 * 16 + 3 * 2 * 16 + 1.5 * 16;

export const ProfileDetails = ({ user }: { user: User }) => {
  return (
    <View
      className="flex-col w-full gap-4 items-center p-4"
      style={{ height: profileDetailsHeight }}
    >
      <ProfilePic />
      <ProfileLabels user={user} />
    </View>
  );
};
