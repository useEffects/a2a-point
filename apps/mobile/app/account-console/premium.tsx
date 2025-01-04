import { ScrollView } from 'app/components/utils/virtual-lists';
import { PremiumCreditsScreen as PremiumCreditsScreenBase } from 'app/screens/account-console/premium-credits';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PremiumCreditsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerClassName="flex-grow"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <PremiumCreditsScreenBase />
    </ScrollView>
  );
}
