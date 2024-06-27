"use client"

import { ProfileScreen } from "app/screens/profile";
import userStore from "app/store/user";

export default function Profile() {
    const { user, company, document } = userStore()
    return <ProfileScreen user={user} company={company} document={document} />
}