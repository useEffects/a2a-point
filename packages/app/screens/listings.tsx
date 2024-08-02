"use client"

import { RangeSlider } from '@react-native-assets/slider';
import BottomSheet from 'app/components/bottomsheet';
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { FormAutoSelect, RenderCompanyTileProps, RenderListingTileProps, RenderUserTileProps, useAutoCompleteItem } from 'app/components/formComponents';
import { Header, HeaderTitle } from 'app/components/header';
import { Bath, BedDouble, CarFront, CreditCard, LandPlot } from 'app/components/icons';
import SearchBar from "app/components/searchbar";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { GoToPostButtonUi } from 'app/components/utils/common-ui';
import { useColorScheme } from "app/hooks/color-scheme";
import useNavigation from 'app/hooks/navigation';
import { useSearchParams } from 'app/hooks/search-params';
import useRouting from 'app/hooks/use-routing';
import { cn } from "app/lib/utils";
import directusStore from "app/store/directus";
import opacity from 'hex-color-opacity';
import { filter, isArray, isNumber, isPlainObject, isString } from 'lodash';
import { Award, Handshake, HousePlus, ListFilter, LucideIcon, LucideProps, Sparkles, X } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { Circle, Svg } from 'react-native-svg';
import { NavigationState, Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import { useParams } from 'solito/navigation';
import { useRouter, usePathname } from 'solito/navigation';
import { useDebounce } from "use-debounce";
import { GoToLoginButton } from "./locked-screens";
import { useLocaleString } from 'app/hooks/locale-string';
import { ListingCardMetrics } from 'app/lib/props';
import { memberRole } from 'app/lib/constants';

export enum FilterKeys {
    Budget = "budget",
    Size = "size",
    Bedrooms = "bedrooms",
    Bathrooms = "bathrooms",
    Parking = "parking",
    Premium = "premium",
    Buy = "buy",
    Sale = "sale",
    GiveOnRent = "give on rent",
    TakeOnRent = "take on rent",
    Location = "location",
    Agent = "agent",
    Company = "company"
}

export type FilterValue = string | [number, number] | CommonFilters
export type Filter = { key: FilterKeys, value: FilterValue }
export type FilterParam = { [key in FilterKeys]?: FilterValue }

const budgetRange: [number, number] = [0, 10000000]
const bedRoomsRange: [number, number] = [0, 8]
const bathRoomsRange: [number, number] = [0, 8]
const parkingRange: [number, number] = [0, 8]
const sizeRange: [number, number] = [0, 10000]

export default function ListingsScreenComponent({ className, data }: { className?: string, data: (MediumListingCardProps & ListingCardMetrics)[] }) {
    const params = useParams()
    const searchParams = useSearchParams()

    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
    const { colors } = useColorScheme()
    const { authenticated } = directusStore()
    const [key, setKey] = useState(0)
    const [filters, setFilters] = useState([] as Filter[])
    const [currentFilters, setCurrentFilters] = useState<Filter[]>([])
    const setParams = useSetParams()

    const updateParams = function (filters: Filter[]) {
        setCurrentFilters(filters)
        const newFilters = filters.reduce<{ [key in FilterKeys]?: FilterValue }[]>((acc, filter) => [...acc, { [filter.key]: filter.value }], [])
        const dispatcher = setParams(newFilters)
        typeof dispatcher === "function" && dispatcher()
        if (Platform.OS === "web") {
            window.history.replaceState(null, "", `?filters=${JSON.stringify(newFilters)}`)
            setKey(key + 1)
        }
    }

    const applyFilters = () => {
        updateParams(currentFilters)
        setBottomSheetVisible(false)
    }

    const finalFilters = useMemo(() => filters.map(f => expandFilterValue(f.key, f.value)), [filters])

    useEffect(() => {
        let parsedFilters: unknown
        if (Platform.OS === "web") {
            try {
                parsedFilters = JSON.parse(searchParams?.get("filters") ?? [].toString())
            } catch (error) {
                console.log(error)
            }
        } else {
            parsedFilters = (params && params.filters) ? params.filters : []
        }
        if (isArray(parsedFilters)) {
            Promise.all(parsedFilters.map(filter => {
                if (isPlainObject(filter)) {
                    const key = Object.keys(filter)[0] as FilterKeys
                    if (filter.hasOwnProperty(key)) {
                        const value = (filter as Record<string, any>)[key]
                        if (isArray(value) && value.length === 2 && isNumber(value[0]) && isNumber(value[1])) {
                            return { key, value: value as [number, number] }
                        } else if (isString(value)) {
                            return { key, value: value as string }
                        }
                        return { key, value }
                    }
                } else return null
            }))
                .then(r => r.filter(r => r?.key && r?.value) as Filter[])
                .then(r => {
                    setFilters(r)
                })
        }
    }, [Platform.OS === "web" ? searchParams?.get("filters") : JSON.stringify(params)])

    useEffect(() => {
        setCurrentFilters(filters)
    }, [filters])

    return <View className={cn("flex-1", className)}>
        <Header className="items-center py-4" height={"auto"}>
            <View className="flex-row flex-1 justify-between items-center">
                <HeaderTitle>Listings</HeaderTitle>
                <GoToPostButtonUi />
            </View>
        </Header>
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
        {filters.length ? <RenderChips filters={filters} setFilters={updateParams} /> : <View className='h-4 w-full bg-card' />}
        <RenderListings<MediumListingCardProps & ListingCardMetrics>
            render={bodies.medium}
            initialData={data}
            flatListProps={{
                ItemSeparatorComponent: () => <Separator />,
                contentContainerClassName: "max-w-xl"
            }}
            filter={filters.length ? commonFilters[CommonFilters.Custom](finalFilters) : undefined}
            searchText={debouncedSearchText}
            infinite
        />
        <BottomSheet
            open={bottomSheetVisible}
            onBackdropPress={() => setBottomSheetVisible(false)}
            setOpen={setBottomSheetVisible}
        >
            <View className="py-4 flex-col gap-8 bg-card w-full">
                <View className="flex-row items-center justify-between px-4">
                    <Text className="text-lg">Filter leads</Text>
                    <Button variant={"destructive"} size={"smallIcon"} onPress={() => setBottomSheetVisible(false)}>
                        <X size={14} className='text-destructive-foreground' />
                    </Button>
                </View>
                <View className='px-4'>
                    <ComboBoxFilters filters={currentFilters} setFilters={setCurrentFilters} />
                </View>
                <Separator />
                <View className='px-4'>
                    <CategoryFilters filters={currentFilters} setFilters={setCurrentFilters} />
                </View>
                <Separator />
                <View className='px-4'>
                    <RangeSliders filters={currentFilters} setFilters={setCurrentFilters} />
                </View>
                <View className='px-4'>
                    {isDifferent(currentFilters, filters) ? <Button onPress={applyFilters} variant={"secondary"}>
                        <Text>Apply</Text>
                    </Button> : <></>}
                </View>
            </View>
        </BottomSheet>
        {!authenticated ? <LoginPopover /> : <></>}
    </View>
}

const RangeSliders = ({ filters, setFilters }: { filters: Filter[], setFilters: (newFilters: Filter[]) => void }) => {
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: FilterKeys.Budget },
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

const RangeSliderTab = (props: SceneRendererProps & { navigationState: NavigationState<Route>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>>, filters: Filter[] }) => {
    const { colors } = useColorScheme()

    return <View className='w-full flex-row justify-between py-4'>
        {props.navigationState.routes.map((route, i) => {
            const Icon = RangeSliderTabIcons(route.key)!
            const isActive = props.filters.some(f => f.key === route.key)
            return <Button className='flex-grow flex-col gap-2 relative' key={i} variant={"base"} size="none" onPress={() => props.setNavigationState(p => ({ ...p, index: i }))}>
                <Svg height={8} width={8} style={{ position: "absolute", top: -8, right: 0, display: isActive ? "flex" : "none" }}>
                    <Circle cx={4} cy={4} r={4} fill={colors.primary} />
                </Svg>
                <Icon className={cn(props.navigationState.index === i ? "text-foreground" : "text-subtext")} />
                <View className={cn("w-full h-[2px] rounded", props.navigationState.index === i ? "bg-foreground" : "bg-transparent")} />
            </Button>
        })}
    </View>
}

const RangeSliderScenes = (props: SceneRendererProps & { route: Route } & { filters: Filter[], setFilters: (newFilters: Filter[]) => void }) => {

    const budget = props.filters.find(f => f.key === FilterKeys.Budget)?.value as [number, number] || budgetRange
    const size = props.filters.find(f => f.key === FilterKeys.Size)?.value as [number, number] || sizeRange
    const bedRooms = props.filters.find(f => f.key === FilterKeys.Bedrooms)?.value as [number, number] || bedRoomsRange
    const bathRooms = props.filters.find(f => f.key === FilterKeys.Bathrooms)?.value as [number, number] || bathRoomsRange
    const parking = props.filters.find(f => f.key === FilterKeys.Parking)?.value as [number, number] || parkingRange

    const dispatcher = (key: FilterKeys, range: [number, number]) => (value: [number, number]) => {
        if (props.filters.some(f => f.key === key)) {
            if (value[0] === range[0] && value[1] === range[1]) {
                props.setFilters(props.filters.filter(f => f.key !== key))
            } else {
                props.setFilters(props.filters.map(f => f.key === key ? { key, value } : f))
            }
        } else {
            props.setFilters([...props.filters, { key, value }])
        }
    }

    switch (props.route.key) {
        case FilterKeys.Budget:
            return <RangeFilter label='Budget' range={budgetRange} value={budget} setValue={dispatcher(FilterKeys.Budget, budgetRange)} />
        case FilterKeys.Size:
            return <RangeFilter label='Size' range={sizeRange} value={size} setValue={dispatcher(FilterKeys.Size, sizeRange)} />
        case FilterKeys.Bedrooms:
            return <RangeFilter label='Bedrooms' range={bedRoomsRange} value={bedRooms} setValue={dispatcher(FilterKeys.Bedrooms, bedRoomsRange)} />
        case FilterKeys.Bathrooms:
            return <RangeFilter label='Bathrooms' range={bathRoomsRange} value={bathRooms} setValue={dispatcher(FilterKeys.Bathrooms, bathRoomsRange)} />
        case FilterKeys.Parking:
            return <RangeFilter label='Parking' range={parkingRange} value={parking} setValue={dispatcher(FilterKeys.Parking, parkingRange)} />
    }
}

const RangeSliderTabIcons = (route: string): LucideIcon | undefined => {
    switch (route) {
        case FilterKeys.Budget:
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

const RangeFilter = ({ value, setValue, range, label }: { value: [number, number], setValue: (newValues: [number, number]) => void, range: [number, number], label: string }) => {
    const { colors } = useColorScheme()
    const [minRange, maxRange] = range
    const [min, max] = value
    const isAtMax = max === maxRange
    const localizedMin = useLocaleString(min)
    const localizedMax = useLocaleString(max)


    return <View className="flex-col gap-2 w-full h-full justify-center">
        <View className='flex-row gap-2 items-center justify-between'>
            <Text>{label}</Text>
            <Text className='text-info'>{localizedMin} - {localizedMax}{isAtMax ? "+" : ""}</Text>
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
            trackStyle={{ height: 2 }}
        />
    </View>
}

const ComboBoxFilters = ({ filters, setFilters }: { filters: Filter[], setFilters: (newFilters: Filter[]) => void }) => {

    const locationId = filters.find(f => f.key === FilterKeys.Location)?.value
    const agentId = filters.find(f => f.key === FilterKeys.Agent)?.value
    const companyId = filters.find(f => f.key === FilterKeys.Company)?.value

    const location = useAutoCompleteItem("rooms", locationId as string | undefined)
    const agent = useAutoCompleteItem("users", agentId as string | undefined)
    const company = useAutoCompleteItem("companies", companyId as string | undefined)

    return <View className='flex flex-col gap-4'>
        <FormAutoSelect
            item='rooms'
            label='Location'
            currentItem={location}
            setCurrentItem={(item) => item ? setFilters([...filters, { key: FilterKeys.Location, value: item.id as string }]) : setFilters(filters.filter(f => f.key !== FilterKeys.Location))}
            filter={{
                type: {
                    _eq: "group"
                }
            }}
        />
        <FormAutoSelect
            item='users'
            label="Agent"
            filter={{
                role: {
                    _eq: memberRole
                }
            }}
            currentItem={agent}
            setCurrentItem={(item) => item ? setFilters([...filters, { key: FilterKeys.Agent, value: item.id as string }]) : setFilters(filters.filter(f => f.key !== FilterKeys.Agent))}
        />
        <FormAutoSelect
            item='companies'
            label='Company'
            currentItem={company}
            setCurrentItem={(item) => item ? setFilters([...filters, { key: FilterKeys.Company, value: item.id as string }]) : setFilters(filters.filter(f => f.key !== FilterKeys.Company))}
        />
    </View>
}

const CategoryFilters = ({ filters, setFilters }: { filters: Filter[], setFilters: (newFilters: Filter[]) => void }) => {
    const { colors } = useColorScheme()

    const handleOnPress = (key: FilterKeys, value: CommonFilters) => {
        if (filters.some(f => f.key === key)) {
            setFilters(filters.filter(f => f.key !== key))
        } else {
            setFilters([...filters, { key: key, value: value }])
        }
    }

    return <View className="flex-row justify-between w-full">
        {categoryTiles.map((category, i) => <Button
            onPress={() => handleOnPress(category.key, category.value)}
            variant={"base"}
            size={"none"}
            key={i}
            className="flex-col gap-1 w-1/5 justify-start">
            {category.Icon({ size: 24, color: filters.some(f => f.key === category.key) ? colors.primary : colors.foreground })}
            <Text className={cn("text-sm text-center w-16 whitespace-normal", filters.some(f => f.key === category.key) ? "text-primary" : "text-foreground")}>{category.title}</Text>
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
        title: "Sale",
        key: FilterKeys.Sale,
        value: CommonFilters.Sale,

    }, {
        Icon: (props: LucideProps) => <CreditCard {...props} />,
        title: "Buy",
        key: FilterKeys.Buy,
        value: CommonFilters.Buy
    }, {
        Icon: (props: LucideProps) => <HousePlus {...props} />,
        title: "Take on rent",
        key: FilterKeys.GiveOnRent,
        value: CommonFilters.GiveOnRent
    },
    {
        Icon: (props: LucideProps) => <Handshake {...props} />,
        title: "Give on rent",
        key: FilterKeys.TakeOnRent,
        value: CommonFilters.TakeOnRent
    }
]

export const LoginPopover = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [canClose, setCanClose] = useState(true)
    const { colors } = useColorScheme()
    const goToLogin = useRouting("login")

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
        <View className="p-4 bg-card flex-col gap-4 w-full">
            <View className="flex-row justify-between w-full">
                <View className="flex-row gap-2">
                    <Sparkles fill={colors.primary} className="text-primary" />
                    <Text className="text-xl font-semibold">Get Started</Text>
                </View>
                {canClose ? <Button variant={"destructive"} size={"smallIcon"} onPress={handleClose}>
                    <X className='text-destructive-foreground' size={14} />
                </Button> : <></>}
            </View>
            <View className="flex-col gap-4">
                <Text>Login to unlock the full application</Text>
                <GoToLoginButton onPress={() => {
                    setIsOpen(false)
                    goToLogin("")
                }} />
            </View>
        </View>
    </BottomSheet>
}

const RenderChips = ({ filters, setFilters }: { filters: Filter[], setFilters: (newFilters: Filter[]) => void }) => {
    const { colors } = useColorScheme()

    const shouldRenderPlus = (max: number, value: number) => value === max ? "+" : ""

    const locationId = filters.find(f => f.key === FilterKeys.Location)?.value
    const agentId = filters.find(f => f.key === FilterKeys.Agent)?.value
    const companyId = filters.find(f => f.key === FilterKeys.Company)?.value

    const location = useAutoCompleteItem("rooms", locationId?.toString()) as RenderListingTileProps | null
    const agent = useAutoCompleteItem("users", agentId?.toString()) as RenderUserTileProps | null
    const company = useAutoCompleteItem("companies", companyId?.toString()) as RenderCompanyTileProps | null

    const getRangeSliderLabel = (key: FilterKeys, value: [number, number], maxRange: number) => {
        const [min, max] = value
        return `${key}: AED ${min.toLocaleString()} - AED ${max.toLocaleString()}${shouldRenderPlus(maxRange, max)}`
    }

    const getLabel = (filter: Filter) => {
        const { key, value } = filter;

        switch (key) {
            case FilterKeys.Location:
                return `Location: ${location?.title}`;
            case FilterKeys.Agent:
                return `Agent: ${agent?.first_name} ${agent?.last_name}`;
            case FilterKeys.Company:
                return `Company: ${company?.title}`;
            case FilterKeys.Budget:
                return getRangeSliderLabel(FilterKeys.Budget, value as [number, number], budgetRange[1]);
            case FilterKeys.Size:
                return getRangeSliderLabel(FilterKeys.Size, value as [number, number], sizeRange[1]);
            case FilterKeys.Bedrooms:
                return getRangeSliderLabel(FilterKeys.Bedrooms, value as [number, number], bedRoomsRange[1]);
            case FilterKeys.Bathrooms:
                return getRangeSliderLabel(FilterKeys.Bathrooms, value as [number, number], bathRoomsRange[1]);
            case FilterKeys.Parking:
                return getRangeSliderLabel(FilterKeys.Parking, value as [number, number], parkingRange[1]);
            default:
                return value;
        }
    };

    const handlePress = (key: FilterKeys) => {
        setFilters(filters.filter(f => f.key !== key));
    }

    return <View className='flex-row gap-2 flex-wrap w-full px-4 py-2 bg-card'>
        {filters.sort((a, b) => a.key.localeCompare(b.key)).map(((filter, index) => <Button onPress={() => handlePress(filter.key)} variant={"base"} size={"none"} style={{ backgroundColor: opacity(colors.info, 0.1) }} className='flex-row gap-1 p-1' key={index}>
            <Text className='text-xs text-info'>{getLabel(filter)}</Text>
        </Button>))}
    </View>
}

const expandFilterValue = (key: FilterKeys, value: FilterValue): Record<string, any> => {
    switch (key) {
        case FilterKeys.Agent: {
            return {
                user_created: {
                    _eq: value
                }
            }
        }
        case FilterKeys.Location: {
            return {
                location: {
                    _eq: value
                }
            }
        }
        case FilterKeys.Company: {
            return {
                user_created: {
                    company: {
                        _eq: value
                    }
                }
            }
        }
        case FilterKeys.Parking:
        case FilterKeys.Bedrooms:
        case FilterKeys.Bathrooms:
        case FilterKeys.Size:
        case FilterKeys.Budget:
            return {
                [key]: {
                    _gte: value[0],
                    _lte: value[1]
                }
            }

        case FilterKeys.Premium:
        case FilterKeys.Buy:
        case FilterKeys.Sale:
        case FilterKeys.GiveOnRent:
        case FilterKeys.TakeOnRent:
            return commonFilters[value as CommonFilters]("" as any)
    }
}

const useSetParams = () => {
    const navigation = useNavigation()
    const pathname = usePathname()
    const router = useRouter()

    const setParams = (newFilters: { [key in FilterKeys]?: FilterValue }[]) => Platform.select({
        native: () => navigation.navigate("listings", { filters: newFilters }),
        web: () => router.push(`${pathname}?filters=${JSON.stringify(newFilters)}`)
    })

    return setParams
}

const isDifferent = (a: Filter[], b: Filter[]) => {
    if (a.length !== b.length) return true
    return a.some((f, i) => f.key !== b[i]?.key || f.value !== b[i]?.value)
}