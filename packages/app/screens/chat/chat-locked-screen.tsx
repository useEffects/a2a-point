import { useColorScheme } from 'app/hooks/color-scheme';
import LockedScreen from '../locked-screens';
import ChatImgDark from 'app/assets/locked-screens/dark/chat.jpg';
import ChatImgLight from 'app/assets/locked-screens/light/chat.jpg';
import { useAuthFlow } from 'app/application/auth/hooks';
import { ChatScreenComponent } from './chat-screen-component';

export const ChatLocked = () => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <LockedScreen
      image={isDarkColorScheme ? ChatImgDark : ChatImgLight}
      headerTitle="Chat"
      title="Chat with other agents!"
      description="Gain access to seamless communication with other agents, real-time updates, and the ability to share property details and documents instantly."
    />
  );
};

export function ChatScreen() {
  const {
    data: { isAuthenticated },
  } = useAuthFlow();

  return isAuthenticated ? <ChatScreenComponent /> : <ChatLocked />;
}
