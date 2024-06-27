"use client"

import { ProfileScreen } from "app/screens/profile"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Company, User, Document } from "app/lib/types"
import { directusUrl } from "app/lib/constants"
import directusStore from "app/store/directus"

export default function ProfileDetailed() {
    const { id } = useParams()
    const { token } = directusStore()
    const { data } = useQuery({
        queryKey: ["Fetch Profile Data", id],
        queryFn: async () => await fetch(`${directusUrl}/users/${id}/?fields=${["*", "company.*", "document.*"].join(",")}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data) as Promise<User & { company: Company | null } & { document: Document | null }>,
        enabled: !!id
    })
    return data ? <ProfileScreen user={data} company={data.company} document={data.document} /> : <></>
}