import { ChatsProvider } from 'app/context/chats';
import { directusStore } from 'app/store/directus';
import { EventProvider } from 'react-native-outside-press';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AuthProvider } from 'app/context/auth';
import { ReactNode } from 'react';
import { QueryClientProvider } from 'app/context/query';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <EventProvider>
          <ChatsProviderComponent>
            <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
              {children}
            </KeyboardProvider>
          </ChatsProviderComponent>
        </EventProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

function ChatsProviderComponent({ children }: { children: ReactNode }) {
  const { authenticated } = directusStore();

  return authenticated ? <ChatsProvider>{children}</ChatsProvider> : children;
}
