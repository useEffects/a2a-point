import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    createDirectus,
    rest,
    staticToken,
    realtime,
    DirectusClient,
    WebSocketClient,
    StaticTokenClient,
    RestClient,
} from "@directus/sdk";
import { directusUrl, directusWSUrl } from "~/lib/constants";

type DirectusContextType = {
    token: string;
    rest: DirectusClient<any> & RestClient<any> & StaticTokenClient<any>;
    realtime: DirectusClient<any> & RestClient<any> & StaticTokenClient<any> & WebSocketClient<any>;
    initialize: (accessToken: string) => Promise<void>;
};

export const DirectusContext = createContext<DirectusContextType>({} as DirectusContextType);

type DirectusProviderProps = {
    children: ReactNode;
};

export const DirectusProvider: React.FC<DirectusProviderProps> = ({ children }) => {
    const [token, setToken] = useState("");
    const [directusRest, setDirectusRest] = useState<DirectusClient<any> & RestClient<any> & StaticTokenClient<any>>(
        createDirectus(directusUrl).with(rest()).with(staticToken(""))
    );
    const [directusRealtime, setDirectusRealtime] = useState<DirectusClient<any> & RestClient<any> & StaticTokenClient<any> & WebSocketClient<any>>(
        createDirectus(directusWSUrl).with(rest()).with(staticToken("")).with(realtime())
    );

    const initialize = async (accessToken: string) => {
        const data = await fetch(`${directusUrl}/users/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                if (res.status === 401) {
                    router.replace("/login");
                }
            }
        }).catch(err => console.log(err));

        setDirectusRest((prev) => prev.with(staticToken(accessToken)));
        setDirectusRealtime((prev) => prev.with(staticToken(accessToken)));
        setToken(accessToken);

        await AsyncStorage.setItem("accessToken", accessToken);
    };

    return (
        <DirectusContext.Provider
            value={{
                token,
                rest: directusRest,
                realtime: directusRealtime,
                initialize,
            }}
        >
            {children}
        </DirectusContext.Provider>
    );
};
