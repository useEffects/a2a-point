import { ProfileScreen as ProfileScreenBase } from 'app/screens/profile';
import userStore from 'app/store/user';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, company, document } = userStore();
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top, paddingBottom: bottom }} className="flex-1">
      <ProfileScreenBase user={user} company={company} document={document} />
    </View>
  );
}
