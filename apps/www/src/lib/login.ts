import { directusUrl, nextUrl } from "./constants";

export const login = (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        if (typeof window !== "undefined") {
            const popup = window.open(`${directusUrl}/auth/login/keycloak?redirect=${nextUrl}/api/callback`, "popup");

            const intervalId = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(intervalId);
                    reject(new Error("Popup window closed"));
                } else if (popup?.location.href) {
                    const url = new URL(popup.location.href);
                    const access_token = url.searchParams.get("access_token");
                    if (access_token) {
                        clearInterval(intervalId);
                        resolve(access_token);
                        popup.close();
                    }
                }
            }, 1000);
        } else {
            reject(new Error("Window object not available"));
        }
    });
};
