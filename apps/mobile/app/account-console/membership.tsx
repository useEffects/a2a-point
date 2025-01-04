import { ScrollView } from 'app/components/utils/virtual-lists';
import { MembershipApplyScreen as MembershipApplyScreenBase } from 'app/screens/account-console/membership-apply';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MembershipScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerClassName="flex-grow"
      contentContainerStyle={{ paddingTop: top }}
    >
      <MembershipApplyScreenBase />
    </ScrollView>
  );
}
