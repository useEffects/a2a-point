import { AccountConsoleParamList, MainTopTabParamList, RootStackParamList } from "app/lib/misc/navigation";
import useNavigation from "../navigation";

export default function useRouting(link: keyof (RootStackParamList & MainTopTabParamList & AccountConsoleParamList)) {
    const navigation = useNavigation()
    switch (link) {
        case "listing-detailed":
        case "profile-detailed":
        case "members-list":
        case "room-detailed":
        case "location-detailed":
            return (id: any) => navigation.push(link, { id })
        case "post-feedback":
            return ({ id, feedbackId }: any) => navigation.push(link, { id: id, feedbackId: feedbackId })
        case "account-console":
        case "activity":
        case "app":
        case "company-list":
        case "locations-list":
        case "login":
        case "notifications":
        case "users-list":
        case "post":
            return () => navigation.push(link)
        case "chat":
        case "home":
        case "offPlans":
        case "profile":
            return () => navigation.navigate(link)
        case "listings":
            return (filters: any) => navigation.navigate(link, { filters })
        case "company":
        case "phone":
        case "membership":
        case "verification":
            return () => alert("Not implemented yet!")
    }
}