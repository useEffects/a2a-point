import { ScrollView } from 'app/components/utils/virtual-lists';
import { CompanySelectScreen as CompanySelectScreenBase } from 'app/screens/account-console/company-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CompanySelectScreen() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerClassName="flex-grow"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <CompanySelectScreenBase />
    </ScrollView>
  );
}
