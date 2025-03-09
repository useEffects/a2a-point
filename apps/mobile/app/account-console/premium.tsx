import { Stacked } from '@/components/stacked';
import {
  PremiumCreditsScreen as PremiumCreditsScreenBase,
  PremiumCreditsScreenHeader,
} from 'app/screens/account-console/premium-credits';

export default function PremiumCreditsScreenComponent() {
  return (
    <Stacked header={() => <PremiumCreditsScreenHeader />}>
      <PremiumCreditsScreenBase />
    </Stacked>
  );
}
