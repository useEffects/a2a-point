import { ScrollView } from 'app/components/utils/virtual-lists';
import { PostScreen as PostScreenBase } from 'app/screens/post';

export default function PostScreen() {
  return (
    <ScrollView>
      <PostScreenBase />
    </ScrollView>
  );
}
