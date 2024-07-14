"use client"

import directusStore from "app/store/directus";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { LogIn } from "lucide-react";
import userStore from "app/store/user";
import { buildAssetUrl } from "app/lib/helpers";
import { useLogin } from '@/hooks/login';
import useRouting from "app/hooks/use-routing";

export default function LoginButton() {
    const { authenticated, logout } = directusStore();
    const { user } = userStore();
    const goToProfile = useRouting("profile")

    const handleLogin = useLogin()

    return authenticated ? <div className="flex flex-col gap-1 items-center">
        <Button onPress={goToProfile} className="flex flex-row gap-2 px-4 py-2 rounded-full" variant={"outline"}>
            <img src={buildAssetUrl(user.avatar)} alt="" className="w-6 h-6 rounded-full object-contain" />
            <Text>Profile</Text>
        </Button>
        <Button onPress={logout} variant={"base"} size={"sm"}>
            <Text className="text-destructive">Logout</Text>
        </Button>
    </div>
        : (
            <Button onPress={handleLogin} variant={"outline"} className="rounded-full flex flex-row items-start">
                <Text>Login&nbsp;</Text>
                <Text><LogIn /></Text>
            </Button>
        );
}
