import { Stacked } from '../../../components/stacked';
import { ProfileScreenHeader } from 'app/components2/templates/profile/header';
import userStore from 'app/store/user';
import React from 'react';
import { useHeader } from '../../../hooks/use-header';
import { ProfileScreen as ProfileScreenComponent } from 'app/screens2/profile/component';

export default function ProfileScreen() {
  const { user, company, document } = userStore();
  useHeader(<ProfileScreenHeader user={user} />);
  return (
    <ProfileScreenComponent user={user} company={company} document={document} />
  );
}
