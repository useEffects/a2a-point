import { ScrollView } from 'app/components/utils/virtual-lists';
import { ActivityScreen as ActivityScreenBase } from 'app/screens/activity';

export default function ActivityScreen() {
  return (
    <ScrollView>
      <ActivityScreenBase />
    </ScrollView>
  );
}
