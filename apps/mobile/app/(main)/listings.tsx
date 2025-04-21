import {
  ListingsScreen as ListingsScreenComponent,
  ListingsScreenHeader,
} from 'app/screens/listings';
import { Stacked } from '../../components/stacked';

export default function ListingsScreen() {
  return (
    <Stacked header={() => <ListingsScreenHeader />}>
      <ListingsScreenComponent data={[]} />
    </Stacked>
  );
}
