import { ScrollView } from 'app/components/utils/virtual-lists';
import { PostScreen as PostScreenBase } from 'app/screens/post';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PostScreen() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: top, bottom }}>
      <PostScreenBase />
    </ScrollView>
  );
}
