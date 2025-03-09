import { Stacked } from '@/components/stacked';
import {
  MembershipApplyScreen as MembershipApplyScreenBase,
  MembershipApplyScreenHeader,
} from 'app/screens/account-console/membership-apply';

export default function MembershipScreenComponent() {
  return (
    <Stacked header={() => <MembershipApplyScreenHeader />}>
      <MembershipApplyScreenBase />
    </Stacked>
  );
}
