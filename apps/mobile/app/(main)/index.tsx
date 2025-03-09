import {
  HomeScreen as HomeScreenComponent,
  HomeScreenHeader,
} from 'app/screens/home';

import { Stacked } from '@/components/stacked';

export default function HomeScreen() {
  return (
    <Stacked header={() => <HomeScreenHeader />}>
      <HomeScreenComponent />
    </Stacked>
  );
}
