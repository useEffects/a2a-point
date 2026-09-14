import { ListingsScreen as ListingsScreenComponent } from 'app/screens/listings';
import { useHeader } from '../../hooks/use-header';
import { ListingsHeader } from 'app/components2/templates/listings/header';

export default function ListingsScreen() {
  useHeader(<ListingsHeader />);

  return <ListingsScreenComponent data={[]} />;
}
