import { useQuery } from "@tanstack/react-query"
import { directusUrl } from "app/lib/constants"
import { User } from "app/lib/types"
import directusStore from "app/store/directus"

export const useUserDetails = (id: string) => {
    const { token } = directusStore()
    const fields = ["id", "first_name", "last_name", "avatar", "plan"]
    const { data } = useQuery({
        queryKey: ["Fetching details for user", id, fields],
        enabled: id.length > 0,
        queryFn: async () => fetch(`${directusUrl}/users/${id}?fields=${fields.join(",")}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data)
    })
    return data as Pick<User, "id" | "first_name" | "last_name" | "avatar" | "plan"> | undefined
}