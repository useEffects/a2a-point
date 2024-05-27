import { DirectusClient, RestClient, StaticTokenClient, WebSocketClient, createDirectus, realtime, rest, staticToken } from "@directus/sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { directusUrl } from "app/lib/constants";
import userStore from "./user";

export type MyDirectusClient = DirectusClient<any> & RestClient<any> & StaticTokenClient<any> & WebSocketClient<any>

type DirectusStore = {
    authenticated: boolean,
    token: string,
    rest: MyDirectusClient,
    initialize: (accessToken: string) => Promise<void>
}

const token = "OjNjXzAdIAH4msY6NfIzfUIn-NpPVFsQ"

const directusStore = create<DirectusStore>((set, get) => ({
    authenticated: false,
    token: token,
    rest: createDirectus(directusUrl).with(rest()).with(staticToken(token)) as MyDirectusClient,
    initialize: async (accessToken: string) => {
        if (!accessToken) {
            throw new Error("Access token cannot be empty");
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

        set({
            rest: createDirectus(directusUrl).with(rest()).with(staticToken(accessToken)) as MyDirectusClient,
            token: accessToken,
            authenticated: true,
        });
        await AsyncStorage.setItem("accessToken", accessToken);
    }
}));

export default directusStore