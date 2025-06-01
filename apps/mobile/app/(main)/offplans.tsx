import {
  OffPlansScreen as OffPlansScreenComponent,
  OffplansScreenHeader,
} from 'app/screens/offplans';
import { Stacked } from '../../components/stacked';
import { useHeader } from '../../hooks/use-header';

export default function OffPlansScreen() {
  useHeader(<OffplansScreenHeader />);
  return <OffPlansScreenComponent />;
}
