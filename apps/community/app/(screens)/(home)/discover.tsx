import { readItem } from "@directus/sdk";
import { SearchBar } from "@rneui/themed";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { set } from "lodash";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDebounce } from "use-debounce";
import { Header } from "~/components/header";
import { CommonFilters, RenderListings, bodies, commonFilterTitles, commonFilters } from "~/components/listings-cards/body/listings";
import { MediumListingCardProps } from "~/components/listings-cards/molecules/medium";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { queryClient } from "~/index";
import { directusUrl } from "~/lib/constants";
import { searchBarContainerStyle, searchBarInputContainerStyle } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
    const { filter, id } = useGlobalSearchParams()
    const { colors } = useColorScheme()
    const navigation = useNavigation()
    const [filterKey, setFilterKey] = useState<keyof typeof CommonFilters | undefined>()
    const [filterMethod, setFilterMethod] = useState<ReturnType<typeof commonFilters[CommonFilters]> | undefined>()
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [headerTitle, setHeaderTitle] = useState("")
    const [searchBarVisible, setSearchBarVisible] = useState(false)

    async function setHeaderTitleWithUserName() {
        if (!id) return
        const { token } = directusStore.getState()
        const fields = ["id", "first_name", "last_name"]
        const { data: user } = await queryClient.fetchQuery({
            queryKey: ["fetching user details with", id, fields],
            queryFn: async () => await fetch(`${directusUrl}/users/${id}/?fields=${fields.join(",")}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.json())
        }) as { data: { id: string, first_name: string, last_name: string } }
        setHeaderTitle(`Listings by ${user?.first_name} ${user?.last_name}`)
    }

    async function setHeaderTitleWithGroupName() {
        if (!id) return
        const { token } = directusStore.getState()
        const fields = ["id", "title"]
        const { data: group } = await queryClient.fetchQuery({
            queryKey: ["fetching group details with", id, fields],
            queryFn: async () => await fetch(`${directusUrl}/items/rooms/${id}/?fields=${fields.join(",")}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.json())
        }) as { data: { id: string, title: string } }
        setHeaderTitle(`Listings in ${group?.title}`)
    }

    useEffect(() => {
        if (!filterKey) {
            setHeaderTitle("Discover all listings")
            return
        }

        const _filterMethod = (filterKey) ? (commonFilters[CommonFilters[filterKey]])(id as string) : undefined
        setFilterMethod(_filterMethod)

        if (CommonFilters[filterKey] === CommonFilters.User) {
            setHeaderTitleWithUserName()
        } else if (CommonFilters[filterKey] === CommonFilters.GroupId) {
            setHeaderTitleWithGroupName()
        } else {
            setHeaderTitle(commonFilterTitles[CommonFilters[filterKey]])
        }
    }, [filterKey])

    useEffect(() => {
        const _filterKey = (Object.keys(CommonFilters) as (keyof typeof CommonFilters)[]).find(key => CommonFilters[key] === filter)
        setFilterKey(_filterKey)
    }, [filter])

    useEffect(() => {
        if (!headerTitle) return
        navigation.setOptions({
            header: () => <Header>
                <View className="flex-row justify-between flex-1 items-center">
                    {searchBarVisible ? <SearchBar
                        placeholder="Search"
                        containerStyle={searchBarContainerStyle}
                        inputContainerStyle={{ ...searchBarInputContainerStyle, borderColor: colors.border, height: 36 }}
                        inputStyle={{ fontSize: 14 }}
                        value={searchText}
                        onChangeText={setSearchText}
                        cursorColor={colors.primary}
                        className="flex-1"
                    /> : <Text className="flex-1">{headerTitle}</Text>}
                    <Button size={"icon"} variant={"ghost"}>
                        <Ionicons name={searchBarVisible ? "return-up-forward-outline" : "search-outline"} size={18} className="!text-foreground" onPress={() => setSearchBarVisible(p => !p)} />
                    </Button>
                </View>
            </Header>
        })
    }, [headerTitle, navigation, searchBarVisible, searchText])

    useEffect(() => {
        return () => {
            navigation.addListener("blur", () => {
                navigation.setOptions({
                    header: () => null
                })
            })
        }
    }, [])

    return <View className="pb-4">
        <RenderListings<MediumListingCardProps>
            render={bodies.medium}
            filterMethod={filterMethod}
            flatListProps={{ ItemSeparatorComponent: () => <Separator className="" /> }}
            searchText={debouncedSearchText}
        />
    </View >
}