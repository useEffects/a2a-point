"use client"

import userStore from "app/store/user"
import { ProfileScreen } from "app/screens/profile"
import directusStore from "app/store/directus"
import Protected from "@/components/protected"

export default function ProfilePage() {
    const { authenticated } = directusStore()
    const { user } = userStore()

    return !authenticated ? <Protected /> : <div className="md:container mb-12">
        <div className="max-w-xl mx-auto">
            <ProfileScreen user={user} />
        </div>
    </div>
}