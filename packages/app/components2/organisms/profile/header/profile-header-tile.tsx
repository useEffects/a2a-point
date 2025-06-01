import { BackButton, HeaderTitle } from 'app/components/header';
import { ToggleTheme } from 'app/components/toggle-theme';
import userStore from 'app/store/user';
import { View } from 'react-native';
import { ProfileHeaderDropdown } from './header-dropdown';
import { User } from 'app/lib/types';

export function ProfileHeaderTile({ user }: { user: User }) {
  const { user: currentUser } = userStore();
  return (
    <View className="w-full flex-row items-center gap-4 h-12">
      {currentUser.id !== user.id && <BackButton />}
      <View className="flex-row items-center justify-between flex-grow">
        <HeaderTitle>
          {currentUser.id !== user.id
            ? `${user.first_name} ${user.last_name}`
            : 'Profile'}
        </HeaderTitle>
        <View className="flex-row gap-[1ch] items-center">
          <ToggleTheme />
          <ProfileHeaderDropdown />
        </View>
      </View>
    </View>
  );
}
