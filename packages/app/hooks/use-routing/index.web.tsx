import { MainTopTabParamList, RootStackParamList } from "app/lib/misc/navigation";
import { FilterParam } from "app/screens/listings";
import { usePathname, useRouter } from "solito/navigation";

export default function useRouting(link: keyof (RootStackParamList & MainTopTabParamList)) {
    const router = useRouter()
    const pathname = usePathname()
    switch (link) {
        case "listing-detailed":
            return (id: string) => router.push(`/listings/${id}`)
        case "profile-detailed":
            return (id: string) => router.push(`/agents/${id}`)
        case "post-feedback":
            return (id: string) => router.push(`post-feedback/${id}`)
        case "room-detailed":
            return (id: string) => router.push(`/chats/${id}`)
        case "location-detailed":
            return (id: string) => router.push(`/locations/${id}`)
        case "members-list":
            return (id: string) => router.push(`/locations/${id}/members`)
        case "account-console":
            return () => router.push("/agents/me/account-console")
        case "activity":
            return () => router.push("/agents/me/activity")
        case "app":
            return () => router.push("/")
        case "company-list":
            return () => router.push("/companies")
        case "locations-list":
            return () => router.push("/locations")
        case "login":
            return () => router.push("/login")
        case "notifications":
            return () => router.push("/agents/me/notifications")
        case "users-list":
            return () => router.push("/agents")
        case "post":
            return () => router.push("/post")
        case "chat":
            return () => router.push("/chat")
        case "home":
            return () => router.push("/")
        case "offPlans":
            return () => router.push("/off-plans")
        case "profile":
            return () => router.push("/profile")
        case "listings":
            return (filters: FilterParam[]) => {
                const searchParams = new URLSearchParams(pathname)
                searchParams.append("filters", JSON.stringify(filters))
                router.push("/listings?" + searchParams.toString())
            }
    }
}