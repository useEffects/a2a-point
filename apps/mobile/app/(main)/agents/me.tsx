import { Stacked } from '../../../components/stacked';
import {
  ProfileScreen as ProfileScreenComponent,
  ProfileScreenHeader,
} from 'app/screens/agents/profile';
import userStore from 'app/store/user';
import React from 'react';
import { useHeader } from '../../../hooks/use-header';

export default function ProfileScreen() {
  const { user, company, document } = userStore();
  useHeader(<ProfileScreenHeader user={user} />);

  return (
    <ProfileScreenComponent user={user} company={company} document={document} />
  );
}
