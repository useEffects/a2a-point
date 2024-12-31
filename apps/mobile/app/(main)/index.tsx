import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    ></ScrollView>
  );
}
