import { Stacked } from '../../components/stacked';
import {
  VerificationApplyScreen as VerificationApplyScreenBase,
  VerificationApplyScreenHeader,
} from 'app/screens/account-console/verification-apply';

export default function VerificationScreenComponent() {
  return (
    <Stacked header={() => <VerificationApplyScreenHeader />}>
      <VerificationApplyScreenBase />
    </Stacked>
  );
}
