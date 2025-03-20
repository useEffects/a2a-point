import { Stacked } from '../../../components/stacked';
import {
  ProfileScreen as ProfileScreenComponent,
  ProfileScreenHeader,
} from 'app/screens/profile';
import userStore from 'app/store/user';
import React from 'react';

export default function ProfileScreen() {
  const { user, company, document } = userStore();
  return (
    <Stacked header={() => <ProfileScreenHeader user={user} />}>
      <ProfileScreenComponent
        user={user}
        company={company}
        document={document}
      />
    </Stacked>
  );
}
