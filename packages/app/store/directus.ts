import { DirectusClient, RestClient, StaticTokenClient, WebSocketClient, createDirectus, realtime, rest, staticToken, AuthenticationClient, authentication, refresh } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { directusUrl } from "app/lib/constants";
import userStore from "./user";

export type MyDirectusClient = DirectusClient<any> & RestClient<any> & AuthenticationClient<any> & WebSocketClient<any>

type DirectusStore = {
    authenticated: boolean,
    token: string,
    refreshToken: string,
    rest: MyDirectusClient,
    initialize: (accessToken: string, refreshToken: string) => Promise<void>,
    logout: () => Promise<void>,
}

const token = "OjNjXzAdIAH4msY6NfIzfUIn-NpPVFsQ"

const directusStore = create<DirectusStore>((set, get) => ({
    authenticated: false,
    token: token,
    refreshToken: "",
    rest: createDirectus(directusUrl).with(rest()).with(staticToken(token)) as MyDirectusClient,
    initialize: async (accessToken: string, refreshToken: string) => {
        if (!accessToken || !refreshToken) {
            return
        }
        try {
            const response = await fetch(`${directusUrl}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                userStore.getState().setUser(data.data);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }

        const client = createDirectus(directusUrl)
            .with(authentication())
            .with(rest())
            .with(staticToken(accessToken))

        set({
            rest: client as MyDirectusClient,
            token: accessToken,
            authenticated: true,
            refreshToken: refreshToken
        });
        setInterval(async () => {
            if (get().authenticated && get().refreshToken) {
                const res = await client.request(refresh("json", get().refreshToken))
                if (!res.access_token || !res.refresh_token) return
                set(p => ({
                    ...p,
                    token: res.access_token!,
                    refreshToken: res.refresh_token!
                }))
                get().rest.setToken(res.access_token!)
                await AsyncStorage.setItem("accessToken", res.access_token!);
                await AsyncStorage.setItem("refreshToken", res.refresh_token!);
            }
        }, 1000 * 60 * 10)
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
    },
    logout: async () => {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        const client = createDirectus(directusUrl)
            .with(rest())
            .with(authentication())
            .with(staticToken(token))

        set({
            authenticated: false,
            token: token,
            rest: client as MyDirectusClient,
        });
    }
}));

export default directusStore