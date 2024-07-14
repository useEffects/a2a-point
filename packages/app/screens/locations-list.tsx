import { MediumLocationCards } from "app/components/cards/molecules/locations"
import { Header, HeaderTitle } from "app/components/header"
import SearchBar from "app/components/searchbar"
import { Text } from "app/components/ui/text"
import { LocationCardMetrics, MediumLocationCardProps } from "app/lib/props"
import { useState } from "react"
import { View } from "react-native"
import { useDebounce } from "use-debounce"

export const LocationsList = ({ data }: { data: (MediumLocationCardProps & LocationCardMetrics)[] }) => {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)

    return <View className="flex-1">
        <Header className="w-full">
            <HeaderTitle>Locations</HeaderTitle>
        </Header>
        <View className="p-4 pt-0 bg-card">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </View>
        <View className="flex-1 max-w-xl">
            <MediumLocationCards
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