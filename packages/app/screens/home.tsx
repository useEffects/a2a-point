import { MediumListingCardProps } from "app/components/listings-cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/listings-cards/molecules/listings";
import SearchBar from "app/components/searchbar";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { useColorScheme } from "app/hooks/color-scheme";
import { useState } from "react";
import { View } from "react-native";
import { useDebounce } from "use-debounce";
import { Award, CreditCard, Home, ListFilter, LucideProps, Sparkles } from "lucide-react-native";
import { BottomSheet } from '@rneui/themed';
import { CloseButton } from "app/components/utils";
import { Text } from "app/components/ui/text";

export default function HomeScreen() {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const [filter, setFilter] = useState<CommonFilters | null>(null)
    const { colors } = useColorScheme()

    return <View className="max-w-xl">
        <View className="flex-row items-center flex-1 justify-between gap-4 mb-12">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                cancelIconProps={{
                    onPress: () => setSearchText("")
                }}
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
    </View>
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