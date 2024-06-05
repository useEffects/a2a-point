"use client"

import directusStore from "app/store/directus";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { LogIn } from "lucide-react";
import userStore from "app/store/user";
import { buildAssetUrl } from "app/lib/helpers";
import { useLogin } from '@/hooks/login';

export default function LoginButton() {
    const { authenticated, logout } = directusStore();
    const { user } = userStore();

    const handleLogin = useLogin()

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
