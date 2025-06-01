import { ChatScreenHeader } from 'app/screens/chat/chat-screen-component';
import { ChatScreen as ChatScreenComponent } from 'app/screens2/chat/chat-screen';
import { Stacked } from '../../components/stacked';
import { useHeader } from '../../hooks/use-header';

export default function ChatScreen() {
  useHeader(<ChatScreenHeader />);
  return <ChatScreenComponent />;
}
