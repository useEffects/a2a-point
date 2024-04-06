import { DirectusClient, RestClient, StaticTokenClient, WebSocketClient, createDirectus, realtime, rest, staticToken } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { directusUrl, directusWSUrl } from "~/lib/constants";
import userStore from "./user";

type DirectusStore = {
    token: string,
    rest: DirectusClient<any> & RestClient<any> & StaticTokenClient<any>,
    initialize: (accessToken: string) => Promise<void>
}

export const directusStore = create<DirectusStore>((set, get) => {
    return {
        token: "",
        rest: createDirectus(directusUrl).with(rest()).with(staticToken("")),
        initialize: async (accessToken: string) => {
            try {
                const response = await fetch(`${directusUrl}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response.status === 200) {
                    const data = await response.json();
                    userStore.getState().setUser(data.data)
                } else {
                    router.replace("/login");
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }

            set(state => ({
                rest: state.rest.with(staticToken(accessToken)),
                // realtime: state.realtime.with(staticToken(accessToken)),
                token: accessToken
            }))
            await AsyncStorage.setItem("accessToken", accessToken)
        }
    };
});

export default directusStore;