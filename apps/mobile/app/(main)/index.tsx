import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen as HomeScreenBase } from 'app/screens/home';

export default function HomeScreen() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      <HomeScreenBase />
    </ScrollView>
  );
}
