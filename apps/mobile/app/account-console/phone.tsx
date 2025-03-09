import { Stacked } from '@/components/stacked';
import {
  PhoneVerificationScreen as PhoneVerificationScreenBase,
  PhoneVerificationScreenHeader,
} from 'app/screens/account-console/phone';

export default function PhoneVerificationScreenComponent() {
  return (
    <Stacked header={() => <PhoneVerificationScreenHeader />}>
      <PhoneVerificationScreenBase />
    </Stacked>
  );
}
