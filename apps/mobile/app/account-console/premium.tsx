import { ScrollView } from 'app/components/utils/virtual-lists';
import { PremiumCreditsScreen as PremiumCreditsScreenBase } from 'app/screens/account-console/premium-credits';

export default function PremiumCreditsScreen() {
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <PremiumCreditsScreenBase />
    </ScrollView>
  );
}
