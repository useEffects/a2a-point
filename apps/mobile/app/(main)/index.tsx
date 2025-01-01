import { ScrollView } from 'app/components/utils/virtual-lists';
import { HomeScreen as Base } from 'app/screens/home';

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
    >
      <Base />
    </ScrollView>
  );
}
