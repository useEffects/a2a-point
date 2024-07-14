"use client"

import { Button } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import directusStore from "app/store/directus";
import userStore from "app/store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeleteAgentPage() {
    const { user } = userStore()
    const { authenticated } = directusStore()
    const router = useRouter()

    useEffect(() => {
        if (!authenticated) {
            router.push("/agents/me")
        }

    }, [authenticated])

    return authenticated ? <div className="container p-4 flex flex-col gap-4 py-6">
        <p className="text-xl">Delete your account</p>
        <p>Are you sure you want to delete your account {user?.email}?</p>
        <p className="text-destructive">Irreversible</p>
        <Button variant={"destructive"} className="self-start">
            <Text>
                delete my account
            </Text>
        </Button>
    </div> : null
}