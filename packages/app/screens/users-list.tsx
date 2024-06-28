import { MediumUsersCardProps } from "app/components/cards/atoms/users"
import { Mode, RenderUsers } from "app/components/cards/molecules/users"
import { Header } from "app/components/header"
import SearchBar from "app/components/searchbar"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { useEffect, useState } from "react"
import { View } from "react-native"

export const UsersListComponent = () => {
    const [searchText, setSearchText] = useState("")
    const [key, setKey] = useState(0)

    useEffect(() => {
        setKey(p => p + 1)
    }, [searchText])

    return <View className="flex-1 flex-col justify-start">
        <Header>
            <Text className="text-xl font-bold">Agents</Text>
        </Header>
        <View className="native:bg-card p-4 pt-0">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </View>
        <RenderUsers<MediumUsersCardProps>
            key={key}
            mode={Mode.medium}
            infinite={!searchText}
            searchText={searchText}
            flatListProps={{
                ItemSeparatorComponent: () => <Separator className="my-8" />,
                contentContainerClassName: "p-4"
            }}
            filter={{
                role: {
                    name: {
                        _eq: "Member"
                    }
                }
            }}
        />
    </View>
}