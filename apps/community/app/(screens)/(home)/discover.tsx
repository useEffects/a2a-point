import { SearchBar } from "@rneui/themed";
import { useGlobalSearchParams, useNavigation } from "expo-router";
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

    return <View className="flex-col gap-4">
        <SearchBar
            placeholder="Search"
            containerStyle={searchBarContainerStyle}
            inputContainerStyle={{ ...searchBarInputContainerStyle, borderColor: colors.border, height: 36 }}
            inputStyle={{ fontSize: 14 }}
            value={searchText}
            onChangeText={setSearchText}
            cursorColor={colors.primary}
        />
        <View className="px-4 pb-4">
            <RenderListings<MediumListingCardProps>
                render={bodies.medium}
                filterMethod={(filterKey && typeof id === "string") ? (commonFilters[CommonFilters[filterKey]])(id as string) : undefined}
                flatListProps={{ ItemSeparatorComponent: () => <Hr className="my-4" /> }}
                searchText={debouncedSearchText}
            />
        </View>
    </View>
}