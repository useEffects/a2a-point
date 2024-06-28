import { readItem } from "@directus/sdk"
import { MembersListScreenComponent } from "app/screens/members-list"
import directusStore from "app/store/directus"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { useParams } from "solito/navigation"

export const MembersList = () => {
    const params = useParams()

    return <View className="flex-1 flex-col gap-4">
        <MembersListScreenComponent locationId={params.locationId as string} />
    </View>
}