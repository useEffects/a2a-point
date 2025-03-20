import {
  ChatScreen as ChatScreenComponent,
  ChatScreenHeader,
} from 'app/screens/chat';
import { Stacked } from '../../components/stacked';

export default function ChatScreen() {
  return (
    <Stacked header={() => <ChatScreenHeader />}>
      <ChatScreenComponent />
    </Stacked>
  );
}
