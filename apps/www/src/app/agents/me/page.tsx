"use client"

import { HeaderContext } from "@/components/app-layout";
import { Separator } from "app/components/ui/separator";
import { ProfileScreen } from "app/screens/profile";
import userStore from "app/store/user";
import { useContext, useEffect } from "react";

export default function Profile() {
    const { user, company, document } = userStore()

    return <ProfileScreen user={user} company={company} document={document} />
}