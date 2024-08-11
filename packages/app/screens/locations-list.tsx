import { MediumLocationCard } from "app/components/cards/molecules/locations"
import { getMediumLocationQueryArgs, mediumLocationCardsQuery } from "app/components/cards/molecules2/locations"
import { Header, HeaderTitle } from "app/components/header"
import InfiniteList from "app/components/infinite"
import SearchBar from "app/components/searchbar"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { LocationCardMetrics, MediumLocationCardProps } from "app/lib/props"
import { useState } from "react"
import { View } from "react-native"
import { useDebounce } from "use-debounce"

export const LocationsList = ({ data }: { data: (MediumLocationCardProps & LocationCardMetrics)[] }) => {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const queryFnArgs = getMediumLocationQueryArgs({
        search: debouncedSearchText
    })

    return <View className="flex-1">
        <Header className="w-full">
            <HeaderTitle>Locations</HeaderTitle>
        </Header>
        <View className="p-4 pt-0 bg-card">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </View>
        <View className="flex-1 max-w-xl">
            <InfiniteList<MediumLocationCardProps & LocationCardMetrics>
                component={item => <MediumLocationCard item={item} />}
                initialItems={data}
                queryFn={mediumLocationCardsQuery}
                queryKey={["locations list", queryFnArgs]}
                queryFnArgs={queryFnArgs}
                infinite
                flatListProps={{
                    contentContainerClassName: "p-4 flex-grow max-w-xl",
                    ItemSeparatorComponent: () => <Separator className="my-4" />,
                }}
            />
        </View>
    </View>
}