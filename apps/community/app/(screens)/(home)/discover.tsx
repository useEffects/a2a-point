import { SearchBar } from "@rneui/themed";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useDebounce } from "use-debounce";
import { CommonFilters, RenderListings, bodies, commonFilters } from "~/components/listings-cards/body/listings";
import { MediumListingCardProps } from "~/components/listings-cards/molecules/medium";
import { Hr } from "~/components/ui/hr";
import { searchBarContainerStyle, searchBarInputContainerStyle } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";

export default function SearchScreen() {
    const { filter, id } = useGlobalSearchParams()
    const { colors } = useColorScheme()
    const filterKey = (Object.keys(CommonFilters) as (keyof typeof CommonFilters)[]).find(key => CommonFilters[key] === filter)
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)

    return <View className="pb-4">
        <SearchBar
            placeholder="Search"
            containerStyle={searchBarContainerStyle}
            inputContainerStyle={{ ...searchBarInputContainerStyle, borderColor: colors.border, height: 36 }}
            inputStyle={{ fontSize: 14 }}
            value={searchText}
            onChangeText={setSearchText}
            cursorColor={colors.primary}
        />
        <RenderListings<MediumListingCardProps>
            render={bodies.medium}
            filterMethod={(filterKey) ? (commonFilters[CommonFilters[filterKey]])(id as string) : undefined}
            flatListProps={{ ItemSeparatorComponent: () => <Hr className="" /> }}
            searchText={debouncedSearchText}
        />
    </View >
}