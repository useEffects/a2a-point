import { useParams } from "solito/navigation"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus";
import { directusUrl } from "app/lib/constants";
import { Company, Document, User } from "app/lib/types";
import { ProfileScreen } from "app/screens/profile";
import userStore from "app/store/user";

export default function ProfileDetailed() {
    const params = useParams<{ id: string }>()
    const { token } = directusStore()

    const fields = ["*", "company.*", "document.*"].join(",")
    const { data } = useQuery({
        queryKey: ["Fetch Profile Data", params.id],
        queryFn: async () => await fetch(`${directusUrl}/users/${params.id}/?fields=${fields}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data) as Promise<User & {
            company: Company | null,
            document: Document | null
        }>,
        enabled: !!params.id,
    })

    return data ? <ProfileScreen user={data} /> : <></>
}