import { ChatsProvider as Provider } from "app/context/chats";
import directusStore from "app/store/directus";
import { ReactNode } from "react";

export default function ChatsProvider({ children }: { children: ReactNode }) {
    const { authenticated, rest, token } = directusStore()

    return authenticated ? <Provider token={token} rest={rest} >
        {children}
    </Provider> : children

}