import { DirectusClient, RestClient, logout, WebSocketClient, createDirectus, rest, staticToken, AuthenticationClient, authentication, refresh } from "@directus/sdk";
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

export const token = "mtEQL7OqngCVDsN2-ncCnKgVccJ_ZI_R"
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
        const resetDirectus = async () => {
            set({ ...reset })
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
        }

        if (!accessToken || !refreshToken) {
            return resetDirectus()
        }
        try {
            const response = await fetch(`${directusUrl}/users/me?fields=*`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200) {
                const { data: user } = await response.json();
                userStore.setState(p => ({
                    ...p,
                    user: user
                }))
                if (user.company) {
                    const company = await fetch(`${directusUrl}/items/companies/${user.company}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    }).then(res => res.json()).then(res => res.data)
                    userStore.setState(p => ({
                        ...p,
                        company: company
                    }))
                }
                if (user.document) {
                    const document = await fetch(`${directusUrl}/items/documents/${user.document}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    }).then(res => res.json()).then(res => res.data)
                    userStore.setState(p => ({ ...p, document: document }))
                }
            } else {
                return resetDirectus()
            }
        } catch (error) {
            console.error("An error occurred:", error);
            return resetDirectus()
        }

        const client = createDirectus(directusUrl)
            .with(authentication())
            .with(rest())
            .with(staticToken(accessToken!))
        set({
            rest: client as MyDirectusClient,
            token: accessToken!,
            authenticated: true,
            refreshToken: refreshToken!
        });
        setInterval(async () => {
            if (get().authenticated && get().refreshToken) {
                const newTokens = await reqNewTokens(get().refreshToken)
                // console.log(newTokens, get().refreshToken)
                get().refreshToken
                if (!newTokens || !newTokens.accessToken || !newTokens.refreshToken) {
                    await AsyncStorage.removeItem("accessToken");
                    await AsyncStorage.removeItem("refreshToken");
                    return resetDirectus()
                }
                set(p => ({
                    ...p,
                    token: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                    rest: createDirectus(directusUrl)
                        .with(authentication())
                        .with(rest())
                        .with(staticToken(newTokens.accessToken)) as MyDirectusClient
                }))
                await AsyncStorage.setItem("accessToken", newTokens.accessToken!);
                await AsyncStorage.setItem("refreshToken", newTokens.refreshToken!);
            }
        }, 1000 * 60 * 5)
        await AsyncStorage.setItem("accessToken", accessToken!);
        await AsyncStorage.setItem("refreshToken", refreshToken!);
    },
    logout: async () => {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        await fetch(`${directusUrl}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${get().token}`,
            },
            body: JSON.stringify({
                mode: "json",
                refresh_token: get().refreshToken
            })

        })
        set({ ...reset })
    }
}));

export const reqNewTokens = async (refreshToken: string) => {
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
    refreshToken: "",
    rest: initialClient as MyDirectusClient,
}

export default directusStore