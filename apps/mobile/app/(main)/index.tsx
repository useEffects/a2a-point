import {
  HomeScreen as HomeScreenComponent,
  HomeScreenHeader,
} from 'app/screens/home';

import { useHeader } from '../../hooks/use-header';

export default function HomeScreen() {
  useHeader(HomeScreenHeader);

  return <HomeScreenComponent />;
}
