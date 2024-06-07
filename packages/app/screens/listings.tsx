import BottomSheet from 'app/components/bottomsheet';
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { CloseButton } from "app/components/link-buttons";
import SearchBar from "app/components/searchbar";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { getListingsCount } from "app/lib/misc/get-counts";
import { cn } from "app/lib/utils";
import directusStore from "app/store/directus";
import userStore from "app/store/user";
import { Award, CreditCard, Home, ListFilter, LucideProps, Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDebounce } from "use-debounce";
import { GoToLoginButton } from "./locked-screens";

export default function ListingsScreenComponent({ className }: { className?: string }) {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const [filter, setFilter] = useState<CommonFilters | null>(null)
    const { colors } = useColorScheme()
    const { authenticated } = directusStore()
    const [collapsed, setCollapsed] = useState(false)
    const { user } = userStore()
    const [listingsCount, setListingsCount] = useState(0)

    useEffect(() => {
        if (setCollapsed) {
            if (searchText) {
                setCollapsed(true)
            } else {
                setCollapsed(false)
            }
        }
    }, [searchText, setCollapsed])

    useEffect(() => {
        getListingsCount().then(setListingsCount)
    }, [])

    return <View className={cn("flex-1", className)}>
        <View className="flex-row items-center justify-between gap-4 w-full bg-card p-4">
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
                ItemSeparatorComponent: () => <Separator />,
                contentContainerClassName: "px-4",
            }}
            filterMethod={filter ? commonFilters[filter]("") : undefined}
            searchText={debouncedSearchText}
            infinite={true}
        />
        <BottomSheet
            open={bottomSheetVisible}
            onBackdropPress={() => setBottomSheetVisible(false)}
            setOpen={setBottomSheetVisible}
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
        {!authenticated ? <LoginPopover /> : <></>}
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

export const LoginPopover = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [canClose, setCanClose] = useState(true)
    const { colors } = useColorScheme()

    // useEffect(() => {
    //     const isOpenTimeout = setInterval(() => {
    //         setIsOpen(true)
    //     }, 1000 * 60 * 1)
    //     const canCloseTimeout = setTimeout(() => {
    //         setCanClose(false)
    //     }, 1000 * 60 * 5)
    //     return () => {
    //         clearInterval(isOpenTimeout)
    //         clearTimeout(canCloseTimeout)
    //     }
    // }, [])

    const handleClose = () => {
        if (!canClose) return
        setIsOpen(false)
    }

    return <BottomSheet open={isOpen} setOpen={setIsOpen} onBackdropPress={handleClose}>
        <View className="p-4 bg-card gap-4 flex flex-row justify-center">
            <View className="md:w-[600px]">
                <View className="flex-row justify-between w-full">
                    <View className="flex-row gap-2">
                        <Sparkles fill={colors.primary} className="text-primary" />
                        <Text className="text-xl font-bold">Get Started</Text>
                    </View>
                    {canClose ? <CloseButton onPress={() => setIsOpen(false)} /> : <></>}
                </View>
                <View className="flex-col gap-4">
                    <Text>Login to unlock the full application</Text>
                    <GoToLoginButton additionalOnPress={() => setIsOpen(false)} />
                </View>
            </View>
        </View>
    </BottomSheet>
}