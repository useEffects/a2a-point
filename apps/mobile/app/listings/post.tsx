import { Stacked } from '@/components/stacked';
import {
  PostScreen as PostScreenComponent,
  PostScreenHeader,
} from 'app/screens/post';

export default function PostScreen() {
  return (
    <Stacked header={() => <PostScreenHeader />}>
      <PostScreenComponent />
    </Stacked>
  );
}
