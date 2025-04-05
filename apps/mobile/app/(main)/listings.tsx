import {
  ListingsScreen as ListingsScreenComponent,
  ListingsScreenHeader,
} from 'app/screens/listings';
import { useQuery } from '@tanstack/react-query';
import { Stacked } from '../../components/stacked';
import { listingsScreenQuery } from '../../queries/listings';

export default function ListingsScreen() {
  const { data } = useQuery({
    ...listingsScreenQuery,
    initialData: [],
  });

  return (
    <Stacked header={() => <ListingsScreenHeader />}>
      <ListingsScreenComponent data={data} />
    </Stacked>
  );
}
