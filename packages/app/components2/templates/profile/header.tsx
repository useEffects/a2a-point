import { Header } from 'app/components/header';
import { ProfileHeaderTile } from 'app/components2/organisms/profile/header/profile-header-tile';
import { User } from 'app/lib/types';

export const ProfileScreenHeader = ({ user }: { user: User }) => {
  return (
    <Header hideSeparator>
      <ProfileHeaderTile user={user} />
    </Header>
  );
};
