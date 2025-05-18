import {
  ListingsScreen as ListingsScreenComponent,
  ListingsScreenHeader,
} from 'app/screens/listings';
import { useHeader } from '../../hooks/use-header';

export default function ListingsScreen() {
  useHeader(ListingsScreenHeader);
  return <ListingsScreenComponent data={[]} />;
}
