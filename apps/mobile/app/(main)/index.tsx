import { HomeScreenHeader } from 'app/components2/organisms/home/header';
import { HomeScreenTemplate } from 'app/components2/templates/home/template';
import { Screen } from 'app/components2/molecules/screen';

import { useHeader } from '../../hooks/use-header';

export default function HomeScreen() {
  useHeader(<HomeScreenHeader />);

  return (
    <Screen>
      <HomeScreenTemplate />
    </Screen>
  );
}
