import { RangeSlider } from '@react-native-assets/slider';
import BottomSheet from 'app/components/bottomsheet';
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { Bath, BedDouble, CarFront, CreditCard, LandPlot } from 'app/components/icons';
import { CloseButton } from "app/components/link-buttons";
import SearchBar from "app/components/searchbar";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Switch } from 'app/components/ui/switch';
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import directusStore from "app/store/directus";
import { Award, Home, ListFilter, LucideIcon, LucideProps, Sparkles } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useDebounce } from "use-debounce";
import { GoToLoginButton } from "./locked-screens";
import { get } from 'lodash';

enum FilterKeys {
    Price = "price",
    Size = "carpet_area",
    Bedrooms = "bedrooms",
    Bathrooms = "bathrooms",
    Parking = "parking",
    Premium = "is_premium",
    Listing = "is_listing",
    Enquiry = "is_enquiry",
    Rent = "is_rent",
}

const priceRange: [number, number] = [0, 10000000]
const bedRoomsRange: [number, number] = [0, 8]
const bathRoomsRange: [number, number] = [0, 8]
const parkingRange: [number, number] = [0, 8]
const sizeRange: [number, number] = [0, 10000]

export default function ListingsScreenComponent({ className }: { className?: string }) {
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const [filters, setFilters] = useState<{ key: FilterKeys, filter: Record<string, any> }[]>([])
    const { colors } = useColorScheme()
    const { authenticated } = directusStore()
    const [price, setPrice] = useState<[number, number]>(priceRange)
    const [bedRooms, setBedrooms] = useState<[number, number]>(bedRoomsRange)
    const [bathRooms, setBathrooms] = useState<[number, number]>(bathRoomsRange)
    const [parking, setParking] = useState<[number, number]>(parkingRange)
    const [size, setSize] = useState<[number, number]>(sizeRange)
    const [key, setKey] = useState(0)

    const _filters = useMemo(() => filters.map(f => f.filter), [filters])
    console.log(JSON.stringify(_filters))

    useEffect(() => {
        setKey(p => p + 1)
    }, [filters, debouncedSearchText])

    useEffect(() => {
        const priceFilter = {
            key: FilterKeys.Price,
            filter: getFilterFromRange(price, "price", price[1] === priceRange[1])
        }
        const bedRoomsFilter = {
            key: FilterKeys.Bedrooms,
            filter: getFilterFromRange(bedRooms, "bedrooms", bedRooms[1] === bedRoomsRange[1])
        }
        const bathRoomsFilter = {
            key: FilterKeys.Bathrooms,
            filter: getFilterFromRange(bathRooms, "bathrooms", bathRooms[1] === bathRoomsRange[1])
        }
        const parkingFilter = {
            key: FilterKeys.Parking,
            filter: getFilterFromRange(parking, "garages", parking[1] === parkingRange[1])
        }
        const sizeFilter = {
            key: FilterKeys.Size,
            filter: getFilterFromRange(size, "carpet_area", size[1] === sizeRange[1])
        }
        const newRangeFilters = [priceFilter, bedRoomsFilter, bathRoomsFilter, parkingFilter, sizeFilter]

        setFilters(filters => {
            const newFilters = filters.filter(f => !newRangeFilters.some(nf => nf.key === f.key))
            return [...newFilters, ...newRangeFilters]
        })

    }, [price, bedRooms, bathRooms, parking, size])

    return <View className={cn("flex-1", className)}>
        <View className="flex-row items-center justify-between gap-4 w-full bg-card p-4 pt-0">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
            <Button
                onPress={() => setBottomSheetVisible(true)}
                variant={"base"}
                size={"icon"}
                className="rounded-full border border-info"
            >
                <ListFilter size={18} color={colors.info} />
            </Button>
        </View>
        <RenderListings<MediumListingCardProps>
            key={key}
            render={bodies.medium}
            flatListProps={{
                ItemSeparatorComponent: () => <Separator />,
                contentContainerClassName: "px-4",
            }}
            filter={filters.length ? commonFilters[CommonFilters.Custom](_filters) : undefined}
            searchText={debouncedSearchText}
            infinite={true}
        />
        <BottomSheet
            open={bottomSheetVisible}
            onBackdropPress={() => setBottomSheetVisible(false)}
            setOpen={setBottomSheetVisible}
        >
            <View className="p-8 flex-col gap-8 bg-card">
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg">Filter leads</Text>
                    <CloseButton onPress={() => setBottomSheetVisible(false)} />
                </View>
                <View className="flex-row justify-between">
                    {categoryTiles.map((category, i) => <Button
                        onPress={() => {
                            if (filters.some(f => f.filter === category.filter)) {
                                setFilters(filters.filter(f => f.key !== category.key))
                            } else {
                                setFilters([...filters, { key: category.key, filter: category.filter }])
                            }
                        }}
                        variant={"base"}
                        size={"none"}
                        key={i}
                        className="flex-col gap-1">
                        <Text>{category.Icon({ size: 24, color: filters.some(f => f.key === category.key) ? colors.primary : colors.foreground })}</Text>
                        <Text className={filters.some(f => f.key === category.key) ? "text-primary" : "text-foreground"}>{category.title}</Text>
                    </Button>)}
                </View>
                <Separator />
                <RangeFilter value={price} setValue={setPrice} range={priceRange} label="Price" icon={CreditCard} />
                <RangeFilter value={size} setValue={setSize} range={sizeRange} label="Size" icon={LandPlot} />
                <RangeFilter value={bedRooms} setValue={setBedrooms} range={bedRoomsRange} label="Bedrooms" icon={BedDouble} />
                <RangeFilter value={bathRooms} setValue={setBathrooms} range={bathRoomsRange} label="Bathrooms" icon={Bath} />
                <RangeFilter value={parking} setValue={setParking} range={parkingRange} label="Parking" icon={CarFront} />
                <Separator />
            </View>
        </BottomSheet>
        {!authenticated ? <LoginPopover /> : <></>}
    </View>
}

const categoryTiles = [
    {
        Icon: (props: LucideProps) => <Award {...props} />,
        title: "Premium",
        filter: commonFilters[CommonFilters.Premium](),
        key: FilterKeys.Premium
    }, {
        Icon: (props: LucideProps) => <Sparkles {...props} />,
        title: "Listing",
        filter: commonFilters[CommonFilters.Listing](),
        key: FilterKeys.Listing

    }, {
        Icon: (props: LucideProps) => <CreditCard {...props} />,
        title: "Enquiry",
        filter: commonFilters[CommonFilters.Enquiry](),
        key: FilterKeys.Enquiry
    }, {
        Icon: (props: LucideProps) => <Home {...props} />,
        title: "Rent",
        filter: commonFilters[CommonFilters.Rent](),
        key: FilterKeys.Rent
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

export const RangeFilter = ({ value, setValue, range, label, icon }: { value: [number, number], setValue: Dispatch<SetStateAction<[number, number]>>, range: [number, number], label: string, icon?: LucideIcon }) => {
    const { colors } = useColorScheme()
    const [minRange, maxRange] = range
    const [min, max] = value
    const isAtMax = max === maxRange
    const Icon = icon

    return <View className="flex-col gap-2">
        <View className='flex-row gap-2 items-center'>
            {Icon && <Icon size={24} className='text-foreground' />}
            <Text className=''>{label}</Text>
            <Text className='text-info ml-auto mr-0 text-right'>{min.toLocaleString()} - {max.toLocaleString()}{isAtMax ? "+" : ""}</Text>
        </View>
        <RangeSlider
            range={value}
            onValueChange={setValue}
            inboundColor={colors.subtext}
            outboundColor={"transparent"}
            thumbTintColor={colors.primary}
            crossingAllowed={false}
            step={Math.ceil((maxRange - minRange) / 100)}
            minimumValue={minRange}
            maximumValue={maxRange}
            trackHeight={1}
            thumbSize={12}
        />
    </View>
}

const getFilterFromRange = (range: [number, number], key: string, isAtMax: boolean) => {
    const [min, max] = range
    return {
        [key]: {
            _gte: min,
            _lte: isAtMax ? undefined : max
        }
    }

}