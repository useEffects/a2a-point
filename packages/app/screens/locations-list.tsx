import { MediumLocationCards } from "app/components/cards/molecules/locations"
import { Header } from "app/components/header"
import SearchBar from "app/components/searchbar"
import { Text } from "app/components/ui/text"
import { useEffect, useState } from "react"
import { View } from "react-native"

export const LocationsList = () => {
    const [searchText, setSearchText] = useState("")
    const [key, setKey] = useState(0)

    useEffect(() => {
        setKey(p => p + 1)
    }, [searchText])

    return <View className="flex-1">
        <Header className="md:py-8 native:py-0 py-0 w-full">
            <Text className="font-bold text-xl native:text-xl md:text-2xl">Locations list</Text>
        </Header>
        <View className="p-4 pt-0 bg-card">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </View>
        <MediumLocationCards
            key={key}
            searchText={searchText}
            infinite={!searchText}
            flatListProps={{
                contentContainerClassName: "p-4 flex-grow max-w-xl"
            }}
        />
    </View>
}