/** @jsxImportSource react */

import { ProfileScreen } from "@/screens/profile"
import { Company, User, Document } from "app/lib/types"
import { directusUrl, memberRole } from "app/lib/constants"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import { fetchAllData } from "@/lib/helpers"

export const revalidate = 60

export default async function ({ params }: { params: { id: string } }) {
    const { id } = params
    const { token } = directusStore.getState()

    fetchAllData("users", {}, ["id"])

    const data = await queryClient.fetchQuery({
        queryKey: ["Fetch Profile Data", id],
        queryFn: async () => await fetch(`${directusUrl}/users/${id}/?fields=${["*", "company.*", "document.*"].join(",")}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data) as Promise<User & { company: Company | null } & { document: Document | null }>,
    })

    return <ProfileScreen user={data} company={data.company} document={data.document} />
}

// export async function generateStaticParams() {
//     return fetchAllData<{ id: string }>("users", {
//         role: {
//             _eq: memberRole
//         }
//     }, ["id"])
// }