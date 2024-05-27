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
const initialClient = createDirectus(directusUrl)
    .with(rest())
    .with(authentication())
    .with(staticToken(token))

const directusStore = create<DirectusStore>((set, get) => ({
    authenticated: false,
    token: token,
    refreshToken: "",
    rest: createDirectus(directusUrl).with(rest()).with(staticToken(token)) as MyDirectusClient,
    initialize: async (accessToken: string, refreshToken: string) => {
        const resetDirectus = () => {
            set({ ...reset })
        }

        if (!accessToken || !refreshToken) {
            return resetDirectus()
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
            } else {
                const error = await response.json();
                return resetDirectus()
            }
        } catch (error) {
            console.error("An error occurred:", error);
            return resetDirectus()
        }

        const newTokens = await reqNewTokens(refreshToken)
        if (!newTokens) {
            return resetDirectus()
        }

        if (!newTokens.accessToken || !newTokens.refreshToken) {
            return resetDirectus()
        } else {
            const client = createDirectus(directusUrl)
                .with(authentication())
                .with(rest())
                .with(staticToken(newTokens.accessToken!))
            set({
                rest: client as MyDirectusClient,
                token: newTokens.accessToken!,
                authenticated: true,
                refreshToken: newTokens.refreshToken!
            });
            setInterval(async () => {
                if (get().authenticated && get().refreshToken) {
                    const newTokens = await reqNewTokens(get().refreshToken)
                    if (!newTokens?.accessToken || !newTokens.refreshToken) {
                        return resetDirectus()
                    }
                    set(p => ({
                        ...p,
                        token: newTokens.accessToken!,
                        refreshToken: newTokens.refreshToken!
                    }))
                    get().rest.setToken(newTokens.accessToken!)
                    await AsyncStorage.setItem("accessToken", newTokens.accessToken!);
                    await AsyncStorage.setItem("refreshToken", newTokens.refreshToken!);
                }
            }, 1000 * 60 * 10)
            await AsyncStorage.setItem("accessToken", newTokens.accessToken!);
            await AsyncStorage.setItem("refreshToken", newTokens.refreshToken!);
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        set({ ...reset })
    }
}));

const reqNewTokens = async (refreshToken: string) => {
    const res = await fetch(`${directusUrl}/auth/refresh`, {
        method: "POST",
        body: JSON.stringify({
            mode: "json",
            refresh_token: refreshToken
        }),
        cache: "no-cache",
        headers: {
            "content-type": "application/json"
        }
    })
    if (res.status !== 200) {
        return null
    } else {
        const { data } = await res.json()
        return { refreshToken: data.refresh_token as string, accessToken: data.access_token as string }
    }
}

const reset = {
    authenticated: false,
    token: token,
    rest: initialClient as MyDirectusClient,
}

export default directusStore