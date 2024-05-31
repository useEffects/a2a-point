import { useParams } from "solito/navigation"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus";
import { directusUrl } from "app/lib/constants";
import { FullUser, User } from "app/lib/types";
import { ProfileScreen } from "app/screens/profile";
import useNavigation from "app/hooks/navigation";
import { useEffect } from "react";
import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";

export default function ProfileDetailed() {
    const params = useParams<{ id: string }>()
    const { token } = directusStore()
    const navigation = useNavigation()

    const fields = ["*", "company.*"].join(",")
    const { data } = useQuery<FullUser>({
        queryKey: ["Fetch Profile Data", params.id],
        queryFn: async () => await fetch(`${directusUrl}/users/${params.id}/?fields=${fields}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data) as Promise<FullUser>,
        enabled: !!params.id
    })
    useEffect(() => {
        if (!data?.first_name || !data?.last_name) return
        navigation.setOptions({
            header: () => <Header>
                <Text>{data.first_name} {data.last_name}</Text>
            </Header>
        })
    }, [navigation, data])

    if (!params.id || !data) return <></>
    else return <ProfileScreen user={data} />
}