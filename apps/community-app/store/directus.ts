import { DirectusClient, RestClient, StaticTokenClient, WebSocketClient, createDirectus, realtime, rest, staticToken } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { directusUrl, directusWSUrl } from "~/lib/constants";
import { User } from "~/types";
import userStore from "./user";

type DirectusStore = {
    token: string,
    rest: DirectusClient<any> & RestClient<any> & StaticTokenClient<any>,
    realtime: DirectusClient<any> & WebSocketClient<any> & StaticTokenClient<any>,
    initialize: (accessToken: string) => void
}

export const directusStore = create<DirectusStore>((set) => {
    return {
        token: "",
        rest: createDirectus(directusUrl).with(rest()).with(staticToken("")),
        realtime: createDirectus(directusWSUrl).with(realtime()).with(staticToken("")),
        initialize: async (accessToken: string) => {
            const data = await fetch(`${directusUrl}/users/me`, {
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
            set(state => ({
                rest: state.rest.with(staticToken(accessToken)),
                realtime: state.realtime.with(staticToken(accessToken)),
                token: accessToken
            }))
            userStore.getState().setUser(data.data as User)
            await AsyncStorage.setItem("accessToken", accessToken)
        }
    };
});

export default directusStore;
