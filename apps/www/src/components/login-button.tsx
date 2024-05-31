"use client"

import { useEffect } from 'react';
import directusStore from "app/store/directus";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { LogIn } from "lucide-react";
import { directusUrl, portfolioUrl } from "app/lib/constants";
import { usePathname } from "next/navigation";
import userStore from "app/store/user";
import { buildAssetUrl } from "app/lib/helpers";

export default function LoginButton() {
    const { authenticated, initialize, logout } = directusStore();
    const { user } = userStore();
    const pathname = usePathname();

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            const { accessToken, refreshToken } = event.data;
            if (accessToken && refreshToken) {
                await initialize(accessToken, refreshToken);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [initialize]);

    const handleLogin = () => {
        const redirectUrl = `${portfolioUrl}/api/auth-redirect?appUrl=${portfolioUrl}${pathname}`;
        const popup = window.open(`${directusUrl}/auth/login/keycloak?redirect=${redirectUrl}`, "login", "width=400,height=600");

        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                return;
            }

            try {
                popup.postMessage({ message: "check_status" }, window.location.origin);
                if (authenticated) {
                    popup.close();
                }
            } catch (error) {
                // Handle potential cross-origin errors or other issues
            }
        }, 1000);
    };

    const handleLogout = async () => {
        await logout();
    };

    return authenticated ? (
        <Button onPress={handleLogout} variant={"outline"} className="rounded-full flex flex-row items-start gap-2">
            <img src={buildAssetUrl(user.avatar)} alt="" className="w-6 h-6 rounded-full" />
            <Text>Logout</Text>
        </Button>
    ) : (
        <Button onPress={handleLogin} variant={"outline"} className="rounded-full flex flex-row items-start">
            <Text>Login&nbsp;</Text>
            <Text><LogIn /></Text>
        </Button>
    );
}
