import { Mode, RenderUsers } from "app/components/cards/molecules/users"
import { Header, HeaderTitle } from "app/components/header"
import SearchBar from "app/components/searchbar"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { memberRole } from "app/lib/constants"
import { MediumUsersCardProps, UsersCardMetrics } from "app/lib/props"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { useDebounce } from "use-debounce"

export const UsersListComponent = ({ data }: { data: (MediumUsersCardProps & UsersCardMetrics)[] }) => {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)

    return <View className="flex-1 flex-col justify-start">
        <Header className="">
            <HeaderTitle>Agents</HeaderTitle>
        </Header>
        <View className="bg-card p-4 pt-0">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </View>
        <View className="flex-grow">
            <RenderUsers<MediumUsersCardProps>
                mode={Mode.medium}
                infinite
                searchText={debouncedSearchText}
                flatListProps={{
                    ItemSeparatorComponent: () => <Separator className="my-8" />,
                    contentContainerClassName: "p-4 max-w-xl flex-grow"
                }}
                filter={{
                    role: {
                        _eq: memberRole
                    }
                }}
                initialData={data}
            />
        </View>
    </View>
}