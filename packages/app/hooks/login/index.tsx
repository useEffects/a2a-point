import { directusUrl, portfolioUrl } from "app/lib/constants";
import directusStore from "app/store/directus";
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from "react";
import { parse } from "search-params";

export const useLogin = (redirect?: string) => {
    const { initialize, authenticated } = directusStore();
    const appURL = "a2apoint-community://"

    useEffect(() => {
        if (authenticated) {
            // navigation.navigate(redirect ?? "app")
        }
    }, [authenticated])

    return async () => {
        const result = await WebBrowser.openAuthSessionAsync(`${directusUrl}/auth/login/keycloak?redirect=${portfolioUrl}/api/auth-redirect?appUrl=${appURL}`, appURL);
        if (result.type === "success") {
            const { access_token: accessToken, refresh_token: refreshToken } = parse(result.url)
            console.log({ accessToken, refreshToken })
            if (accessToken && refreshToken) {
                await initialize(accessToken.toString(), refreshToken.toString())
            }
        }
    }
}