import { MediumLocationCards } from "app/components/cards/molecules/locations"
import SearchBar from "app/components/searchbar"
import { useEffect, useState } from "react"
import { View } from "react-native"

export const LocationsList = () => {
    const [searchText, setSearchText] = useState("")
    const [key, setKey] = useState(0)

    useEffect(() => {
        setKey(p => p + 1)
    }, [searchText])

    return <View className="flex-1">
        <View className="p-4 pt-0 bg-card">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </View>
        <MediumLocationCards
            key={key}
            searchText={searchText}
            infinite={!searchText}
        />
    </View>
}