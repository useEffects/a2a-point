import { Header } from 'app/components/header';
import { PortalHost } from 'app/components/primitives/portal';
import { ProfileHeaderTile } from 'app/components2/organisms/profile/header/profile-header-tile';
import { User } from 'app/lib/types';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

export const ProfileScreenHeader = ({ user }: { user: User }) => {
  return (
    <View className="flex-col w-full">
      <Header hideSeparator>
        <ProfileHeaderTile user={user} />
      </Header>
      <PortalHost name={profileScreenHeaderPortalName} />
    </View>
  );
};

export const profileScreenHeaderPortalName = 'profile-header-slot';
