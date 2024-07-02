import { Mode, RenderUsers } from "app/components/cards/molecules/users"
import { Header } from "app/components/header"
import SearchBar from "app/components/searchbar"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { memberRole } from "app/lib/constants"
import { MediumUsersCardProps } from "app/lib/props"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { useDebounce } from "use-debounce"

export const UsersListComponent = ({ data }: { data: MediumUsersCardProps[] }) => {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [showInitialData, setShowInitialData] = useState(true)
    const [key, setKey] = useState(0)

    useEffect(() => {
        setKey(p => p + 1)
        setShowInitialData(!Boolean(searchText))
    }, [debouncedSearchText])

    return <View className="flex-1 flex-col justify-start">
        <Header className="py-8 native:py-0">
            <Text className="text-xl font-bold">Agents</Text>
        </Header>
        <View className="bg-card p-4 pt-0">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </View>
        <View className="flex-grow">
            <RenderUsers<MediumUsersCardProps>
                key={key}
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
                showInitialData={showInitialData}
            />
        </View>
    </View>
}