import { ChatScreenHeader } from 'app/screens/chat/chat-screen-component';
import { ChatScreen as ChatScreenComponent } from 'app/screens2/chat/chat-screen';
import { Stacked } from '../../components/stacked';

export default function ChatScreen() {
  return (
    <Stacked header={() => <ChatScreenHeader />} shouldWrap={false}>
      <ChatScreenComponent />
    </Stacked>
  );
}
