import { ScrollView } from 'app/components/utils/virtual-lists';
import { MembershipApplyScreen as MembershipApplyScreenBase } from 'app/screens/account-console/membership-apply';

export default function MembershipScreen() {
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <MembershipApplyScreenBase />
    </ScrollView>
  );
}
