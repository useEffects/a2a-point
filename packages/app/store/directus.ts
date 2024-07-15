import { DirectusClient, RestClient, logout, WebSocketClient, createDirectus, rest, staticToken, AuthenticationClient, authentication, refresh } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { directusUrl, isDevBuild } from "app/lib/constants";
import userStore from "./user";
import jwt from "expo-jwt"

export type MyDirectusClient = DirectusClient<any> & RestClient<any> & AuthenticationClient<any> & WebSocketClient<any>

type DirectusStore = {
    authenticated: boolean,
    token: string,
    refreshToken: string,
    rest: MyDirectusClient,
    initialize: (accessToken: string, refreshToken: string) => Promise<void>,
    logout: () => Promise<void>,
}

export const publicToken = isDevBuild ? "e7KhchQTdEjDaoqHtJ9rCV4wtuf7-l8K" : "Mnh7gFAmU4QeNRt_TQhTBrDDBxFdjPNu"
// export const publicToken = "Mnh7gFAmU4QeNRt_TQhTBrDDBxFdjPNu"

const refreshTokenExpiration = 1000 * 60 * 60 * 24 * 60
const accessTokenExpiration = 1000 * 60 * 60 * 2

const initialClient = createDirectus(directusUrl)
    .with(rest())
    .with(authentication())
    .with(staticToken(publicToken))

const directusStore = create<DirectusStore>((set, get) => ({
    authenticated: false,
    token: publicToken,
    refreshToken: "",
    rest: createDirectus(directusUrl).with(rest()).with(staticToken(publicToken)) as MyDirectusClient,
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
                const existingRefreshToken = get().refreshToken
                const existingAccessToken = get().token
                if (!shouldRefresh(existingAccessToken)) return
                const newTokens = await reqNewTokens(existingRefreshToken)
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
        }, 1000 * 60 * 60)
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
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        return null
    } else {
        const { data } = await res.json()
        return { refreshToken: data.refresh_token as string, accessToken: data.access_token as string }
    }
}

const reset = {
    authenticated: false,
    token: publicToken,
    refreshToken: "",
    rest: initialClient as MyDirectusClient,
}

export const shouldRefresh = (token: string | null) => {
    if(!token) return false
    try {
        const decoded = jwt.decode(token, "")
        console.log(decoded)
        if (decoded && typeof decoded === "object") {
            const exp = decoded.exp as number
            const now = new Date().getTime() / 1000
            return exp - now < (accessTokenExpiration / 7)
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
    return false
}

export default directusStore
