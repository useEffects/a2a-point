import { DirectusClient, RestClient, WebSocketClient, createDirectus, realtime, rest, staticToken } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { directusLocalUrl, directusUrl, directusWSLocalUrl } from "~/lib/constants";
import { User } from "~/types";
import userStore from "./user";

type DirectusStore = {
    client: DirectusClient<any> & RestClient<any>,
    ws: DirectusClient<any> & WebSocketClient<any>,
    getClient: () => DirectusClient<any>,
    initialize: (accessToken: string) => void
}

export const directusStore = create<DirectusStore>((set, get) => {
    return {
        isReady: false,
        client: createDirectus(directusLocalUrl).with(rest()),
        ws: createDirectus(directusWSLocalUrl).with(realtime()),
        getClient: () => get().client,
        initialize: async (accessToken: string) => {
            const data = await fetch(`${directusLocalUrl}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    router.replace("/login")
                }
            })
            get().client.with(staticToken(accessToken))
            get().ws.with(staticToken(accessToken))
            userStore.getState().setUser(data.data as User)
            await AsyncStorage.setItem("accessToken", accessToken)
        }
    };
});

export default directusStore;
