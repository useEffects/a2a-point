import { ChatsProvider } from "app/context/chats";
import directusStore from "app/store/directus";
import { ReactNode } from "react";
import { EventProvider } from "react-native-outside-press";
import { PortalHost } from "../primitives/portal";
import { QueryClientProvider } from "app/context/query";
import { KeyboardGestureArea, KeyboardProvider } from "react-native-keyboard-controller";

export const Providers = ({ children }: { children: ReactNode }) => {
    return <EventProvider>
        <QueryClientProvider>
            <ChatsProviderComponent>
                <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
                    {children}
                    <PortalHost />
                </KeyboardProvider>
            </ChatsProviderComponent>
        </QueryClientProvider>
    </EventProvider>
}

function ChatsProviderComponent({ children }: { children: ReactNode }) {
    const { authenticated, rest, token } = directusStore()

    return authenticated ? <ChatsProvider token={token} rest={rest}>
        {children}
    </ChatsProvider> : children

}