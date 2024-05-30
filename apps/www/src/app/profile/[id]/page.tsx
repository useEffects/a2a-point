"use client"

import { Profile } from "app/screens/profile"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { FullUser } from "app/lib/types"
import directusStore from "app/store/directus"
import { directusUrl } from "app/lib/constants"

export default function ProfileLayout() {
    const { id } = useParams()
    const { token } = directusStore()
    const { data: user } = useQuery<FullUser>({
        queryKey: ["Fetching user", id],
        queryFn: async () => await fetch(`${directusUrl}/users/${id}?fields=${["*", "company.*"].join(",")}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => res.json()).then((res) => res.data),
    })

    return user ? <div className="container mb-12">
        <div className="max-w-xl mx-auto">
            <Profile user={user} />
        </div>
    </div> : <></>
}