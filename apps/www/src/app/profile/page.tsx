"use client"

import userStore from "app/store/user"
import { ProfileScreen } from "app/screens/profile"

export default function ProfilePage() {
    const { user } = userStore()
    return <div className="md:container mb-12">
        <div className="max-w-xl mx-auto">
            <ProfileScreen user={user} />
        </div>
    </div>
}