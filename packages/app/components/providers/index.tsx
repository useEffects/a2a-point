import { ChatsProvider } from 'app/context/chats';
import { directusStore } from 'app/store/directus';
import { EventProvider } from 'react-native-outside-press';
import { PortalHost } from '../primitives/portal';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'app/context/auth';
import { queryStore } from 'app/store/query';
import { ReactNode, useEffect } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = queryStore();
  useEffect(() => {
    queryStore.setState(new QueryClient());
  }, []);

  return (
    Object.keys(queryClient).length && (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <EventProvider>
            <ChatsProviderComponent>
              <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
                {children}
                <PortalHost />
              </KeyboardProvider>
            </ChatsProviderComponent>
          </EventProvider>
        </AuthProvider>
      </QueryClientProvider>
    )
  );
};

function ChatsProviderComponent({ children }: { children: ReactNode }) {
  const { authenticated } = directusStore();

  return authenticated ? <ChatsProvider>{children}</ChatsProvider> : children;
}
