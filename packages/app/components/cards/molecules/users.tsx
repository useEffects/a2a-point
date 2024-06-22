import { MediumUsersCard, SmallUsersCard, mediumUsersFields, smallUsersFields } from "../atoms/users"
import directusStore from "app/store/directus"
import { directusUrl } from "app/lib/constants"
import { ComponentType, useEffect, useState } from "react"
import { FlatList } from "app/components/utils/virtual-lists"
import { FlatListProps, View } from "react-native"
import { queryClient } from "app/store/query"
import { BottomLoader } from "./listings"
import { GoToUsersListButton } from "app/components/link-buttons"
import { ViewAllButton } from "app/components/utils/common-ui"

export enum Mode {
    small = "small",
    medium = "medium",
}

export enum CommonFilters {
    Location = "location",
    Company = "company",
}

const bodies = {
    small: {
        fields: smallUsersFields,
        renderMethod: SmallUsersCard
    },
    medium: {
        fields: mediumUsersFields,
        renderMethod: MediumUsersCard
    }
} as {
        [key in Mode]: {
            fields: string[],
            renderMethod: ComponentType<any>
        }
    }

const commonFilters = {
    [CommonFilters.Company]: (company: string) => ({
        company: {
            _eq: company
        }
    })
}

export const RenderUsers = <R,>({ mode, limit = 5, sort = [], filter, searchText = "", infinite, flatListProps = {} }: { mode: Mode, limit?: number, filter?: Record<string, any>, sort?: string[], searchText?: string, infinite?: boolean, flatListProps?: Omit<FlatListProps<R>, "data" | "renderItem"> }) => {

    const { token } = directusStore()
    const { fields, renderMethod: Component } = bodies[mode]
    const [data, setData] = useState<R[]>([])
    const [offset, setOffset] = useState(0)
    const [endReached, setEndReached] = useState(false)

    useEffect(() => {
        async function fetchData() {
            if (endReached) return
            if (process.env.NODE_ENV === "development" && data.length) return
            const url = `${directusUrl}/users/?fields=${fields.join(",")}&limit=${limit}&filter=${filter ? JSON.stringify(filter) : ""}&sort=${sort.join(",")}&offset=${offset * limit}&search=${searchText}`
            const res = await queryClient.fetchQuery<R[]>({
                queryKey: ["fetching users list", fields, filter, limit, offset],
                queryFn: async () => await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => res.json()).then(res => res.data) as R[],
                initialData: []
            })
            if (!res.length) {
                setEndReached(true)
            }
            else {
                setData(p => [...p, ...res])
            }
        }
        fetchData()
    }, [offset, endReached])


    return <FlatList
        data={data}
        renderItem={({ item }) => <Component {...item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        onEndReached={(infinite && !endReached) ? () => setOffset(p => p + 1) : undefined}
        ListFooterComponent={infinite ? <BottomLoader endReached={endReached} /> : <ViewAllButton horizontal={!!flatListProps.horizontal}
            button={(props) => <GoToUsersListButton {...props} />}
        />}
        {...flatListProps}
    />
}