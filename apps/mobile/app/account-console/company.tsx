import { ScrollView } from 'app/components/utils/virtual-lists';
import { CompanySelectScreen as CompanySelectScreenBase } from 'app/screens/account-console/company-select';

export default function CompanySelectScreen() {
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <CompanySelectScreenBase />
    </ScrollView>
  );
}
