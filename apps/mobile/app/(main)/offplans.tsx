import {
  OffPlansScreen as OffPlansScreenComponent,
  OffplansScreenHeader,
} from 'app/screens/offplans';
import { Stacked } from '../../components/stacked';

export default function OffPlansScreen() {
  return (
    <Stacked header={() => <OffplansScreenHeader />}>
      <OffPlansScreenComponent />
    </Stacked>
  );
}
