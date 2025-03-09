import { Stacked } from '@/components/stacked';
import {
  CompanySelectScreen as CompanySelectScreenBase,
  CompanySelectScreenHeader,
} from 'app/screens/account-console/company-select';

export default function CompanySelectScreenComponent() {
  return (
    <Stacked header={() => <CompanySelectScreenHeader />}>
      <CompanySelectScreenBase />
    </Stacked>
  );
}
