import { useQuery } from "@tanstack/react-query"
import { directusUrl } from "~/lib/constants"
import directusStore from "~/store/directus"

export const useUserDetails = (id: string) => {
    const { token } = directusStore()
    const fields = ["id", "first_name", "last_name", "avatar"]
    const { data } = useQuery({
        queryKey: ["Fetching details for user", id, fields],
        enabled: id.length > 0,
        queryFn: async () => fetch(`${directusUrl}/users/${id}?fields=${fields.join(",")}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data)
    })
    return data as { id: string, first_name: string, last_name: string, avatar: string } | undefined
}