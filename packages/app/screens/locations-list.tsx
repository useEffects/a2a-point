import { MediumLocationCards } from "app/components/cards/molecules/locations"
import { Header } from "app/components/header"
import SearchBar from "app/components/searchbar"
import { Text } from "app/components/ui/text"
import { MediumLocationCardProps } from "app/lib/props"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { useDebounce } from "use-debounce"

export const LocationsList = ({ data }: { data: MediumLocationCardProps[] }) => {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [key, setKey] = useState(0)

    return <View className="flex-1">
        <Header className="md:py-8 native:py-0 py-0 w-full">
            <Text className="font-bold text-xl native:text-xl md:text-2xl">Locations list</Text>
        </Header>
        <View className="p-4 pt-0 bg-card">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </View>
        <View className="flex-1">
            <MediumLocationCards
                key={key}
                initialData={data}
                searchText={debouncedSearchText}
                infinite
                flatListProps={{
                    contentContainerClassName: "p-4 flex-grow max-w-xl"
                }}
            />
        </View>
    </View>
}