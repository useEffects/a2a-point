import { Header } from "app/components/header"
import { MediumListingCardProps } from "app/components/listings-cards/atoms/medium"
import { SmallListingCardProps } from "app/components/listings-cards/atoms/small"
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/listings-cards/molecules/listings"
import { LocationCards } from "app/components/listings-cards/molecules/locations"
import SearchBar from "app/components/searchbar"
import { Button } from "app/components/ui/button"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { useColorScheme } from "app/hooks/color-scheme"
import userStore from "app/store/user"
import { ArrowUpRight, LucideProps } from "lucide-react-native"
import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import Collapsible from "react-native-collapsible"
import { ListFilter, Award, Sparkles, CreditCard, Home } from "lucide-react-native"
import { BottomSheet } from '@rneui/themed';
import { CloseButton } from "app/components/utils"
import { useDebounce } from "use-debounce";

export const HomeScreen = () => {
    const { user } = userStore()
    const [collapsed, setCollapsed] = useState(false)
    const { colors } = useColorScheme()
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const [filter, setFilter] = useState<CommonFilters | null>(null)

    useEffect(() => {
        if (searchText.length > 0) {
            setCollapsed(true)
        } else {
            setCollapsed(false)
        }
    }, [searchText])

    return (
        <ScrollView
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            overScrollMode={"never"}
            className="flex-1 flex-col gap-8">
            <Header className="items-center py-4" height={"auto"}>
                <View className="flex-row justify-between flex-1">
                    <View>
                        <Text className="text-subtext">Welcome back,</Text>
                        <Text className="text-lg text-success">{user.first_name} {user.last_name}</Text>
                    </View>
                </View>
            </Header>
            <View className="px-4">
                <Collapsible duration={500} collapsed={collapsed}>
                    <View className="flex-col pt-8 pb-4 gap-8">
                        <Button variant={"base"} size={"none"} className="flex-row gap-1 items-center">
                            <Text className="text-right w-40 ml-auto mr-0 text-subtext">Premium listings curated by A2APoint</Text>
                            <ArrowUpRight size={24} color={colors.info} />
                        </Button>
                        <RenderListings<SmallListingCardProps>
                            render={bodies.small}
                            flatListProps={{
                                horizontal: true,
                            }}
                        />
                        <View className="flex-col gap-2">
                            <Text className="text-subtext">Browse popular locations</Text>
                            <LocationCards />
                        </View>
                        <Separator />
                        <View className="">
                            <Text className="text-2xl font-medium">Let&apos;s search your next lead!</Text>
                        </View>
                    </View>
                </Collapsible>
                <View className="flex-col gap-6" style={{ paddingTop: collapsed ? 16 : undefined }}>
                    <View className="flex-row items-center flex-1 justify-between gap-4">
                        <SearchBar
                            searchText={searchText}
                            setSearchText={setSearchText}
                        />
                        <Button
                            onPress={() => setBottomSheetVisible(true)}
                            variant={"base"}
                            size={"none"}
                            className="rounded-full border border-info relative"
                            style={{ height: 40, width: 40 }}
                        >
                            {filter ? <View className="w-2 h-2 rounded-full absolute bg-warning top-2 right-2"></View> : <></>}
                            <ListFilter size={18} color={colors.info} />
                        </Button>
                    </View>
                    <RenderListings<MediumListingCardProps>
                        render={bodies.medium}
                        flatListProps={{
                            scrollEnabled: false,
                            ItemSeparatorComponent: () => <Separator />,
                        }}
                        filterMethod={filter ? commonFilters[filter]("") : undefined}
                        searchText={debouncedSearchText}
                    />
                </View>
            </View>
            <BottomSheet
                isVisible={bottomSheetVisible}
                onBackdropPress={() => setBottomSheetVisible(false)}
                backdropStyle={{ backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: "transparent" }}
                scrollViewProps={{
                    scrollEnabled: false,
                }}
            >
                <View className="p-8 flex-col gap-8 bg-card">
                    <View className="flex-row gap-4 items-center">
                        <CloseButton onPress={() => setBottomSheetVisible(false)} />
                        <View>
                            <Text className="text-lg">Filter leads</Text>
                            <Text className="text-subtext">Click again to disable the filter</Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between">
                        {categoryTiles.map((category, i) => <Button
                            onPress={() => {
                                if (filter === category.filterMethod) {
                                    setFilter(null)
                                } else {
                                    setFilter(category.filterMethod)
                                }
                                setBottomSheetVisible(false)
                            }}
                            variant={"base"}
                            size={"none"}
                            key={i}
                            className="flex-col gap-1">
                            <Text>{category.Icon({ size: 24, color: filter === category.filterMethod ? colors.primary : colors.foreground })}</Text>
                            <Text className={filter === category.filterMethod ? "text-primary" : "text-foreground"}>{category.title}</Text>
                        </Button>)}
                    </View>
                </View>
            </BottomSheet>
        </ScrollView>
    )
}

const categoryTiles = [
    {
        Icon: (props: LucideProps) => <Award {...props} />,
        title: "Premium",
        filterMethod: CommonFilters.Premium
    }, {
        Icon: (props: LucideProps) => <Sparkles {...props} />,
        title: "Listing",
        filterMethod: CommonFilters.Listing
    }, {
        Icon: (props: LucideProps) => <CreditCard {...props} />,
        title: "Enquiry",
        filterMethod: CommonFilters.Enquiry
    }, {
        Icon: (props: LucideProps) => <Home {...props} />,
        title: "Rent",
        filterMethod: CommonFilters.Rent
    }
]