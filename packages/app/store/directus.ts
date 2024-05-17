import { DirectusClient, RestClient, StaticTokenClient, WebSocketClient, createDirectus, realtime, rest, staticToken } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "solito/router";
import { create } from "zustand";
import { directusUrl } from "app/lib/constants";
import userStore from "./user";

export type MyDirectusClient = DirectusClient<any> & RestClient<any> & StaticTokenClient<any> & WebSocketClient<any>

type DirectusStore = {
    token: string,
    rest: MyDirectusClient,
    initialize: (accessToken: string) => Promise<void>
}

const directusStore = create<DirectusStore>((set, get) => {
    const router = useRouter()
    if(!get().token) {
        throw new Error("Store not initialized")
    }

    return {
        token: "",
        rest: createDirectus(directusUrl).with(rest()) as MyDirectusClient,
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

            set({
                rest: createDirectus(directusUrl).with(rest()).with(staticToken(accessToken)) as MyDirectusClient,
                // realtime: state.realtime.with(staticToken(accessToken)),
                token: accessToken
            })
            await AsyncStorage.setItem("accessToken", accessToken)
        }
    };
});

export default directusStore;