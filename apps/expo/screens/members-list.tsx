import { MembersListScreenComponent } from "app/screens/members-list"
import { View } from "react-native"
import { useParams } from "solito/navigation"

export const MembersList = () => {
    const params = useParams()

    return <View className="flex-1 flex-col gap-4">
        <MembersListScreenComponent locationId={params.locationId as string} />
    </View>
}