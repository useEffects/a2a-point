import { ScrollView } from 'app/components/utils/virtual-lists';
import { ActivityScreen as ActivityScreenBase } from 'app/screens/activity';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <ActivityScreenBase />
    </ScrollView>
  );
}
