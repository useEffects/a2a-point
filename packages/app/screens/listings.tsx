import { RangeSlider } from '@react-native-assets/slider';
import BottomSheet from 'app/components/bottomsheet';
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { Bath, BedDouble, CarFront, CreditCard, LandPlot, X } from 'app/components/icons';
import { CloseButton } from "app/components/link-buttons";
import SearchBar from "app/components/searchbar";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import directusStore from "app/store/directus";
import { Award, Home, ListFilter, LucideIcon, LucideProps, Sparkles } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useDebounce } from "use-debounce";
import { GoToLoginButton } from "./locked-screens";
import { NavigationState, Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import { AutoCompleteRenderItemProps, FormAutoSelect, RenderCompanyTileProps, RenderListingTileProps, RenderUserTileProps, autoCompleteFields } from 'app/components/formComponents';
import opacity from 'hex-color-opacity';
import { queryClient } from 'app/store/query';
import { directusUrl } from 'app/lib/constants';
import { readItem } from '@directus/sdk';
import { useParams } from 'solito/navigation';

export enum FilterKeys {
    Price = "Price",
    Size = "Size",
    Bedrooms = "Bedrooms",
    Bathrooms = "Bathrooms",
    Parking = "Parking",
    Premium = "Premium",
    Listing = "Listing",
    Enquiry = "Enquiry",
    Rent = "Is Rent",
    Location = "Group",
    Agent = "Agent",
    Company = "Company"
}

type FilterValue = AutoCompleteRenderItemProps | [number, number] | CommonFilters
export type FilterType = { key: FilterKeys, filter: Record<string, any>, value: FilterValue }

const priceRange: [number, number] = [0, 10000000]
const bedRoomsRange: [number, number] = [0, 8]
const bathRoomsRange: [number, number] = [0, 8]
const parkingRange: [number, number] = [0, 8]
const sizeRange: [number, number] = [0, 10000]

export default function ListingsScreenComponent({ className }: { className?: string }) {
    const params = useParams()

    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const [filters, setFilters] = useState<FilterType[]>([])
    const { colors } = useColorScheme()
    const { authenticated } = directusStore()
    const [key, setKey] = useState(0)

    const _filters = useMemo(() => filters.map(f => f.filter), [filters])

    useEffect(() => {
        setKey(p => p + 1)
    }, [filters, debouncedSearchText])

    useEffect(() => {
        const initialFilter = (params?.key && (params?.id !== undefined || params?.id !== null)) ? getInitialFilter(params.key as FilterKeys, params.id as string) : Promise.resolve(null)
        Promise.resolve(initialFilter).then(filter => {
            if (filter) {
                setFilters([filter])
            }
        })
    }, [params])

    return <View className={cn("flex-1", className)}>
        <View className="flex-row items-center justify-between gap-4 w-full bg-card px-4">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
            <Button
                onPress={() => setBottomSheetVisible(true)}
                variant={"base"}
                size={"icon"}
                className={cn("rounded-full border", !filters.length ? "border-info" : "border-success bg-success")}
            >
                <ListFilter size={18} color={filters.length ? colors.card : colors.info} />
            </Button>
        </View>
        {filters.length ? <RenderChips filters={filters} setFilters={setFilters} /> : <View className='h-4 w-full bg-card' />}
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
            <View className="p-4 flex-col gap-8 bg-card">
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg">Filter leads</Text>
                    <CloseButton onPress={() => setBottomSheetVisible(false)} />
                </View>
                <ComboBoxFilters filters={filters} setFilters={setFilters} />
                <Separator />
                <CategoryFilters filters={filters} setFilters={setFilters} />
                <Separator />
                <RangeSliders filters={filters} setFilters={setFilters} />
            </View>
        </BottomSheet>
        {!authenticated ? <LoginPopover /> : <></>}
    </View>
}

const RangeSliders = ({ filters, setFilters }: { filters: FilterType[], setFilters: Dispatch<SetStateAction<FilterType[]>> }) => {
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: FilterKeys.Price },
            { key: FilterKeys.Size },
            { key: FilterKeys.Bedrooms },
            { key: FilterKeys.Bathrooms },
            { key: FilterKeys.Parking }
        ]
    })
    return <TabView
        style={{ height: 32 * 4, maxHeight: 32 * 4 }}
        navigationState={navigationState}
        onIndexChange={index => setNavigationState(s => ({ ...s, index }))}
        renderScene={(props) => <RangeSliderScenes {...props} setFilters={setFilters} filters={filters} />}
        renderTabBar={(props) => <RangeSliderTab {...props} setNavigationState={setNavigationState} filters={filters} />}
        swipeEnabled={false}
    />
}

const RangeSliderTab = (props: SceneRendererProps & { navigationState: NavigationState<Route>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>>, filters: FilterType[] }) => {
    return <View className='w-full flex-row justify-between py-4'>
        {props.navigationState.routes.map((route, i) => {
            const Icon = RangeSliderTabIcons(route.key)!
            const isActive = props.filters.some(f => f.key === route.key)
            return <Button className='flex-grow flex-col gap-2 relative' key={i} variant={"base"} size="none" onPress={() => props.setNavigationState(p => ({ ...p, index: i }))}>
                <View className={cn('absolute h-2 w-2 rounded-full top-0 right-0', isActive && "bg-primary")} />
                <Icon className={cn(props.navigationState.index === i ? "text-foreground" : "text-subtext")} />
                <View className={cn("w-full h-[1px]", props.navigationState.index === i ? "bg-foreground" : "bg-transparent")} />
            </Button>
        })}
    </View>
}

const RangeSliderScenes = (props: SceneRendererProps & { route: Route } & { filters: FilterType[], setFilters: Dispatch<SetStateAction<FilterType[]>> }) => {

    const initialPrice = props.filters.find(f => f.key === FilterKeys.Price)?.value as [number, number] || priceRange
    const initialSize = props.filters.find(f => f.key === FilterKeys.Size)?.value as [number, number] || sizeRange
    const initialBedrooms = props.filters.find(f => f.key === FilterKeys.Bedrooms)?.value as [number, number] || bedRoomsRange
    const initialBathrooms = props.filters.find(f => f.key === FilterKeys.Bathrooms)?.value as [number, number] || bathRoomsRange
    const initialParking = props.filters.find(f => f.key === FilterKeys.Parking)?.value as [number, number] || parkingRange

    const [price, setPrice] = useState<[number, number]>(initialPrice)
    const [bedRooms, setBedrooms] = useState<[number, number]>(initialBedrooms)
    const [bathRooms, setBathrooms] = useState<[number, number]>(initialBathrooms)
    const [parking, setParking] = useState<[number, number]>(initialParking)
    const [size, setSize] = useState<[number, number]>(initialSize)

    useEffect(() => {
        const newRangeFilters: FilterType[] = []
        if (price[0] !== priceRange[0] || price[1] !== priceRange[1]) {
            newRangeFilters.push({
                key: FilterKeys.Price,
                filter: getFilterFromRange(price, "price", price[1] === priceRange[1]),
                value: price
            })
        }
        if (size[0] !== sizeRange[0] || size[1] !== sizeRange[1]) {
            newRangeFilters.push({
                key: FilterKeys.Size,
                filter: getFilterFromRange(size, "carpet_area", size[1] === sizeRange[1]),
                value: size
            })
        }
        if (bedRooms[0] !== bedRoomsRange[0] || bedRooms[1] !== bedRoomsRange[1]) {
            newRangeFilters.push({
                key: FilterKeys.Bedrooms,
                filter: getFilterFromRange(bedRooms, "bedrooms", bedRooms[1] === bedRoomsRange[1]),
                value: bedRooms
            })
        }
        if (bathRooms[0] !== bathRoomsRange[0] || bathRooms[1] !== bathRoomsRange[1]) {
            newRangeFilters.push({
                key: FilterKeys.Bathrooms,
                filter: getFilterFromRange(bathRooms, "bathrooms", bathRooms[1] === bathRoomsRange[1]),
                value: bathRooms
            })
        }
        if (parking[0] !== parkingRange[0] || parking[1] !== parkingRange[1]) {
            newRangeFilters.push({
                key: FilterKeys.Parking,
                filter: getFilterFromRange(parking, "parking", parking[1] === parkingRange[1]),
                value: parking
            })
        }

        props.setFilters(filters => {
            const newFilters = filters.filter(f => !newRangeFilters.some(nf => nf.key === f.key))
            return [...newFilters, ...newRangeFilters]
        })

        if (parking[0] === parkingRange[0] && parking[1] === parkingRange[1]) {
            props.setFilters(filters => filters.filter(f => f.key !== FilterKeys.Parking))
        }
        if (bathRooms[0] === bathRoomsRange[0] && bathRooms[1] === bathRoomsRange[1]) {
            props.setFilters(filters => filters.filter(f => f.key !== FilterKeys.Bathrooms))
        }
        if (bedRooms[0] === bedRoomsRange[0] && bedRooms[1] === bedRoomsRange[1]) {
            props.setFilters(filters => filters.filter(f => f.key !== FilterKeys.Bedrooms))
        }
        if (size[0] === sizeRange[0] && size[1] === sizeRange[1]) {
            props.setFilters(filters => filters.filter(f => f.key !== FilterKeys.Size))
        }
        if (price[0] === priceRange[0] && price[1] === priceRange[1]) {
            props.setFilters(filters => filters.filter(f => f.key !== FilterKeys.Price))
        }

    }, [price, bedRooms, bathRooms, parking, size])

    switch (props.route.key) {
        case FilterKeys.Price:
            return <RangeFilter label='Price' range={priceRange} value={price} setValue={setPrice} />
        case FilterKeys.Size:
            return <RangeFilter label='Size' range={sizeRange} value={size} setValue={setSize} />
        case FilterKeys.Bedrooms:
            return <RangeFilter label='Bedrooms' range={bedRoomsRange} value={bedRooms} setValue={setBedrooms} />
        case FilterKeys.Bathrooms:
            return <RangeFilter label='Bathrooms' range={bathRoomsRange} value={bathRooms} setValue={setBathrooms} />
        case FilterKeys.Parking:
            return <RangeFilter label='Parking' range={parkingRange} value={parking} setValue={setParking} />
    }
}

const RangeSliderTabIcons = (route: string): LucideIcon | undefined => {
    switch (route) {
        case FilterKeys.Price:
            return CreditCard
        case FilterKeys.Size:
            return LandPlot
        case FilterKeys.Bedrooms:
            return BedDouble
        case FilterKeys.Bathrooms:
            return Bath
        case FilterKeys.Parking:
            return CarFront
    }
}

const RangeFilter = ({ value, setValue, range, label }: { value: [number, number], setValue: Dispatch<SetStateAction<[number, number]>>, range: [number, number], label: string }) => {
    const { colors } = useColorScheme()
    const [minRange, maxRange] = range
    const [min, max] = value
    const isAtMax = max === maxRange

    return <View className="flex-col gap-2 w-full h-full justify-center">
        <View className='flex-row gap-2 items-center justify-between'>
            <Text>{label}</Text>
            <Text className='text-info'>{min.toLocaleString()} - {max.toLocaleString()}{isAtMax ? "+" : ""}</Text>
        </View>
        <RangeSlider
            style={{ paddingHorizontal: 8 }}
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

const ComboBoxFilters = ({ filters, setFilters }: { filters: FilterType[], setFilters: Dispatch<SetStateAction<FilterType[]>> }) => {

    const initialLocation = filters.find(f => f.key === FilterKeys.Location)?.value as RenderListingTileProps | null
    const initialAgent = filters.find(f => f.key === FilterKeys.Agent)?.value as RenderUserTileProps | null
    const initialCompany = filters.find(f => f.key === FilterKeys.Company)?.value as RenderCompanyTileProps | null

    const [location, setLocation] = useState<RenderListingTileProps | null>(initialLocation)
    const [agent, setAgent] = useState<RenderUserTileProps | null>(initialAgent)
    const [company, setCompany] = useState<RenderCompanyTileProps | null>(initialCompany)

    useEffect(() => {
        if (location) {
            setFilters(filters => {
                const existingFilter = filters.find(f => f.key === FilterKeys.Location)
                if (existingFilter) {
                    return filters.map(f => f.key === FilterKeys.Location ? { ...f, value: location } : f)
                }
                return [...filters, { key: FilterKeys.Location, filter: { group: location.id }, value: location }]
            })
        }
        if (agent) {
            setFilters(filters => {
                const existingFilter = filters.find(f => f.key === FilterKeys.Agent)
                if (existingFilter) {
                    return filters.map(f => f.key === FilterKeys.Agent ? { ...f, value: agent } : f)
                }
                return [...filters, { key: FilterKeys.Agent, filter: { user_created: agent.id }, value: agent }]
            })
        }
        if (company) {
            setFilters(filters => {
                const existingFilter = filters.find(f => f.key === FilterKeys.Company)
                if (existingFilter) {
                    return filters.map(f => f.key === FilterKeys.Company ? { ...f, value: company } : f)
                }
                return [...filters, {
                    key: FilterKeys.Company, filter: {
                        user_created: {
                            company: {
                                _eq: company.id
                            }
                        }
                    }, value: company
                }]
            })
        }
        if (!location) setFilters(filters => filters.filter(f => f.key !== FilterKeys.Location))
        if (!agent) setFilters(filters => filters.filter(f => f.key !== FilterKeys.Agent))
        if (!company) setFilters(filters => filters.filter(f => f.key !== FilterKeys.Company))
    }, [location, agent, company])

    return <View className='flex flex-col gap-4'>
        <FormAutoSelect
            item='rooms'
            label='Location'
            currentItem={location}
            setCurrentItem={(item) => item && setLocation(item as RenderListingTileProps)}
            filter={{
                type: {
                    _eq: "group"
                }
            }}
        />
        <FormAutoSelect
            item='users'
            label="Agents"
            currentItem={agent}
            setCurrentItem={(item) => item && setAgent(item as RenderUserTileProps)}
        />
        <FormAutoSelect
            item='companies'
            label='Company'
            currentItem={company}
            setCurrentItem={(item) => item && setCompany(item as RenderCompanyTileProps)}
        />
    </View>
}

const CategoryFilters = ({ filters, setFilters }: { filters: FilterType[], setFilters: Dispatch<SetStateAction<FilterType[]>> }) => {
    const { colors } = useColorScheme()

    return <View className="flex-row justify-between">
        {categoryTiles.map((category, i) => <Button
            onPress={() => {
                if (filters.some(f => f.value === category.value)) {
                    setFilters(filters.filter(f => f.key !== category.key))
                } else {
                    setFilters([...filters, { key: category.key, filter: commonFilters[category.value]({} as any), value: category.value }])
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
}

const categoryTiles = [
    {
        Icon: (props: LucideProps) => <Award {...props} />,
        title: "Premium",
        key: FilterKeys.Premium,
        value: CommonFilters.Premium,
    }, {
        Icon: (props: LucideProps) => <Sparkles {...props} />,
        title: "Listing",
        key: FilterKeys.Listing,
        value: CommonFilters.Listing,

    }, {
        Icon: (props: LucideProps) => <CreditCard {...props} />,
        title: "Enquiry",
        key: FilterKeys.Enquiry,
        value: CommonFilters.Enquiry
    }, {
        Icon: (props: LucideProps) => <Home {...props} />,
        title: "Rent",
        key: FilterKeys.Rent,
        value: CommonFilters.Rent
    }
]

export const LoginPopover = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [canClose, setCanClose] = useState(true)
    const { colors } = useColorScheme()

    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return
        const isOpenTimeout = setInterval(() => {
            setIsOpen(true)
        }, 1000 * 60 * 1)
        const canCloseTimeout = setTimeout(() => {
            setCanClose(false)
        }, 1000 * 60 * 5)
        return () => {
            clearInterval(isOpenTimeout)
            clearTimeout(canCloseTimeout)
        }
    }, [])

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

const RenderChips = ({ filters, setFilters }: { filters: FilterType[], setFilters: Dispatch<SetStateAction<FilterType[]>> }) => {
    const { colors } = useColorScheme()

    const shouldRenderPlus = (max: number, value: number) => value === max ? "+" : ""

    const getLocationLabel = (value: FilterValue) => {
        return `Location: ${(value as RenderListingTileProps).title}`;
    };

    const getAgentLabel = (value: FilterValue) => {
        const { first_name, last_name } = value as RenderUserTileProps;
        return `Agent: ${first_name} ${last_name}`;
    };

    const getCompanyLabel = (value: FilterValue) => {
        return `Company: ${(value as RenderCompanyTileProps).title}`;
    };

    const getPriceLabel = (value: FilterValue) => {
        const [minPrice, maxPrice] = value as [number, number];
        return `Price AED ${minPrice.toLocaleString()} - AED ${maxPrice.toLocaleString()}${shouldRenderPlus(priceRange[1], maxPrice)}`;
    };

    const getSizeLabel = (value: FilterValue) => {
        const [minSize, maxSize] = value as [number, number];
        return `Size ${minSize.toLocaleString()}sq.ft - ${maxSize.toLocaleString()}sq.ft${shouldRenderPlus(sizeRange[1], maxSize)}`;
    };

    const getBedroomsLabel = (value: FilterValue) => {
        const [minBedrooms, maxBedrooms] = value as [number, number];
        return `Bedrooms ${minBedrooms} - ${maxBedrooms}${shouldRenderPlus(bedRoomsRange[1], maxBedrooms)}`;
    };

    const getBathroomsLabel = (value: FilterValue) => {
        const [minBathrooms, maxBathrooms] = value as [number, number];
        return `Bathrooms ${minBathrooms} - ${maxBathrooms}${shouldRenderPlus(bathRoomsRange[1], maxBathrooms)}`;
    };

    const getLabel = (filter: FilterType) => {
        const { key, value } = filter;

        switch (key) {
            case FilterKeys.Location:
                return getLocationLabel(value);
            case FilterKeys.Agent:
                return getAgentLabel(value);
            case FilterKeys.Company:
                return getCompanyLabel(value);
            case FilterKeys.Price:
                return getPriceLabel(value);
            case FilterKeys.Size:
                return getSizeLabel(value);
            case FilterKeys.Bedrooms:
                return getBedroomsLabel(value);
            case FilterKeys.Bathrooms:
                return getBathroomsLabel(value);
            default:
                return key;
        }
    };

    const handlePress = (key: FilterKeys) => {
        setFilters(filters => filters.filter(f => f.key !== key))
    }

    return <View className='flex-row gap-2 flex-wrap w-full px-4 py-2 bg-card'>
        {filters.map(((filter, index) => <Button onPress={() => handlePress(filter.key)} variant={"base"} size={"none"} style={{ backgroundColor: opacity(colors.info, 0.1) }} className='flex-row gap-1 p-1' key={index}>
            <X className='text-destructive' size={12} />
            <Text className='text-xs text-info'>{getLabel(filter)}</Text>
        </Button>))}
    </View>
}

const getInitialFilter = async (key: FilterKeys, id: string): Promise<FilterType | null> => {
    const { rest, token } = directusStore.getState()
    switch (key) {
        case FilterKeys.Agent: {
            const data = await queryClient.fetchQuery<RenderUserTileProps>({
                queryKey: ["Fetching for param", key, id],
                queryFn: async () => await fetch(`${directusUrl}/users/${id}?fields=${autoCompleteFields.users.join(",")}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }).then(res => res.json()).then(res => res.data)
            })
            return {
                key: FilterKeys.Agent,
                filter: { user_created: id },
                value: data
            }
        }
        case FilterKeys.Location: {
            const data = await queryClient.fetchQuery<RenderListingTileProps>({
                queryKey: ["Fetching for param", key, id],
                queryFn: async () => await rest.request(readItem("rooms", id, {
                    fields: autoCompleteFields.rooms,
                })) as RenderListingTileProps
            })
            return {
                key: FilterKeys.Location,
                filter: { group: id },
                value: data
            }
        }
        case FilterKeys.Premium: {
            return {
                key: FilterKeys.Premium,
                filter: commonFilters[CommonFilters.Premium](),
                value: CommonFilters.Premium
            }
        }
        default: return null
    }
}