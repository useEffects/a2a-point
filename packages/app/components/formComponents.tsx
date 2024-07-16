/* eslint-disable react/display-name */
import { readItem, readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { useColorScheme } from "app/hooks/color-scheme";
import { directusUrl } from "app/lib/constants";
import { buildAssetUrl } from "app/lib/helpers";
import { Amenity, Company, Listing, Room, User } from "app/lib/types";
import { cn } from "app/lib/utils";
import directusStore from "app/store/directus";
import { ReactNode, useMemo, useState } from "react";
import { DimensionValue, Image, Platform, TextInputProps, View } from "react-native";
import Collapsible from "react-native-collapsible";
import OutsidePressHandler from 'react-native-outside-press';
import { useDebounce } from "use-debounce";
import { SelectRootProps } from "./primitives/select/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Text } from "./ui/text";
import { UserChip } from "./user-chip";
import { MaterialSymbolIcon } from "./material-symbol-icon";
import { X } from "lucide-react-native";

type AdditionalFormInputProps = {
    error?: string,
    label?: string,
    maxLines?: number,
    initialHeight?: DimensionValue,
    rightComponent?: () => ReactNode,
    autoSelect?: boolean,
}

export const initialInputHeight = 40

export const FormInput = (props: TextInputProps & AdditionalFormInputProps) => {
    const { error, label, maxLines = 4, ...rest } = props
    const [height, setHeight] = useState<DimensionValue>(props.initialHeight ?? initialInputHeight)
    const { colors } = useColorScheme()

    const RightComponent = props.rightComponent ?? (() => <></>)

    const handleSizeChange = (newHeight: number) => {
        if (newHeight <= initialInputHeight * maxLines && newHeight >= initialInputHeight) {
            setHeight(newHeight)
        }
    }

    return <View className="flex-col gap-2 flex-grow">
        <View className="flex-row justify-between items-center">
            {props.label && <Text className={cn("text-sm", error?.length ? "text-destructive" : "text-subtext")}>{label}</Text>}
            {props.autoSelect && error && <Text className="text-destructive text-xs text-right">{error}</Text>}
        </View>
        <View className="flex-row gap-4 items-center">
            <Input
                {...rest}
                style={{ height: Platform.OS !== "web" ? height : undefined, borderColor: error?.length ? colors.destructive : colors.border }}
                onContentSizeChange={e => handleSizeChange(e.nativeEvent.contentSize.height)}
                multiline={Platform.OS !== "web"}
                className={cn("text-base flex-grow", props.readOnly && "text-subtext", rest.className)}
            />
            <RightComponent />
        </View>
        {!props.autoSelect && error && <Text className="text-destructive text-xs">{error}</Text>}
    </View>
}

type AdditionalFormSelectProps = {
    label?: string,
    error?: string,
    placeholder?: string,
    options: { value: string, label: string }[],
    customSelectTrigger?: ReactNode,
    asChild?: boolean,
}

export const FormSelect = (props: SelectRootProps & AdditionalFormSelectProps) => {
    const { error, label, placeholder, options, ...rest } = props

    return <View className="flex-col gap-2">
        <Text className={cn("text-sm", error?.length ? "text-destructive" : "text-subtext")}>{label}</Text>
        <Select>
            <SelectTrigger className={cn(error ? "border-destructive" : "border-border")}>
                <SelectValue className="text-foreground font-normal" placeholder={props.value?.label ?? ""}>
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-60" sideOffset={-40 + 8}>
                <SelectGroup>
                    {props.options.map((option, index) => <SelectItem key={index} value={option.value} label={option.label}>
                        <SelectLabel>{option.label}</SelectLabel>
                    </SelectItem>)}
                </SelectGroup>
            </SelectContent>
        </Select>
    </View>
}

export type AutoCompleteRenderItemProps = RenderListingTileProps | RenderRoomTileProps | RenderUserTileProps | RenderCompanyTileProps | Amenity

export const autoCompleteFields = {
    "amenities_base": ["id", "label", "icon"],
    "rooms": ["id", "title", "avatar"],
    "listings": ["id", "title", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name"],
    "users": ["id", "avatar", "first_name", "last_name"],
    "companies": ["id", "avatar", "title"]
}

type AdditionalAutoSelectFormProps = {
    item: keyof typeof autoCompleteFields,
    currentItem: AutoCompleteRenderItemProps | null,
    setCurrentItem: (item: AutoCompleteRenderItemProps | null) => void,
    filter?: Record<string, any>,
    initialValue?: AutoCompleteRenderItemProps
}

export const isRenderUserTile = (item: AutoCompleteRenderItemProps | undefined): item is RenderUserTileProps => {
    return !!item && "first_name" in item && "last_name" in item
}

export const isAmenity = (item: AutoCompleteRenderItemProps | undefined): item is Amenity => {
    return !!item && "label" in item && "icon" in item
}

export const getTitle = (item: AutoCompleteRenderItemProps | null) => {
    if (!item) return ""
    if (isRenderUserTile(item)) {
        return `${item.first_name} ${item.last_name}`
    } else if (isAmenity(item)) {
        return item.label
    } else {
        return item.title!
    }
}

export const useAutoCompleteItem = (item: keyof typeof autoCompleteFields, id: string | undefined | null, filter: Record<string, any> = {}) => {
    const { rest, token } = directusStore()

    const { data } = useQuery<AutoCompleteRenderItemProps | null>({
        queryKey: ["Fetch AutoComplete Data", item, id, autoCompleteFields[item]],
        queryFn: async () => item === "users" ?
            await fetch(`${directusUrl}/users/${id}?fields=${autoCompleteFields[item].join(",")}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.json()).then(res => res.data as RenderUserTileProps) :
            await rest.request(readItem(item, id!, {
                filter: filter,
                fields: autoCompleteFields[item]
            })) as AutoCompleteRenderItemProps,
        enabled: Boolean(id),
        initialData: null
    })
    return data
}

export const FormAutoSelect = (props: TextInputProps & AdditionalFormInputProps & AdditionalAutoSelectFormProps) => {
    const isRenderRoomTile = (item: AutoCompleteRenderItemProps | undefined): item is RenderRoomTileProps => {
        return props.item === "rooms"
    }
    const isRenderListingTile = (item: AutoCompleteRenderItemProps | undefined): item is RenderListingTileProps => {
        return props.item === "listings"
    }
    const isRenderCompanyTile = (item: AutoCompleteRenderItemProps | undefined): item is RenderCompanyTileProps => {
        return props.item === "companies"
    }

    const title = useMemo(() => {
        return getTitle(props.currentItem)
    }, [props.currentItem])

    const { rest, token } = directusStore()
    const [searchText, setSearchText] = useState(title)
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [showResults, setShowResults] = useState(false)

    const { data } = useQuery<AutoCompleteRenderItemProps[]>({
        queryKey: ["Fetch AutoComplete Data", props.item, debouncedSearchText],
        queryFn: async () => props.item === "users" ?
            await fetch(`${directusUrl}/users/?filter=${JSON.stringify(props.filter) || ""}&limit=5&search=${debouncedSearchText}&fields=${autoCompleteFields[props.item].join(",")}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.json()).then(res => res.data) :
            await rest.request(readItems(props.item, {
                filter: props.filter ?? {},
                search: debouncedSearchText,
                fields: autoCompleteFields[props.item],
                limit: 5
            })) as AutoCompleteRenderItemProps[],
        initialData: [],
    })

    const handleChange = (val: string) => {
        props.setCurrentItem(null)
        setSearchText(val)
        setShowResults(true)
    }

    const RenderItem = (item: AutoCompleteRenderItemProps) => {
        if (isRenderUserTile(item)) {
            return <RenderUserTile {...item} currentId={props.currentItem?.id as string | undefined} />
        }
        if (isRenderCompanyTile(item)) {
            return <RenderCompanyTile {...item} currentId={props.currentItem?.id as string | undefined} />
        }
        if (isRenderRoomTile(item)) {
            return <RenderRoomTile {...item} currentId={props.currentItem?.id as string | undefined} />
        }
        if (isRenderListingTile(item)) {
            return <RenderListingTile {...item} currentId={props.currentItem?.id as string | undefined} />
        }
        if (isAmenity(item)) {
            return <RenderAmenityTile {...item} currentId={props.currentItem?.id as number | undefined} />
        }
    }

    return <View className="w-full">
        <FormInput
            label={props.label}
            error={props.error}
            value={searchText}
            onChangeText={handleChange}
            onFocus={() => setShowResults(true)}
            className={cn(showResults && "rounded-b-none outline-none", props.className)}
            autoSelect={showResults}
            rightComponent={() => showResults && <Button onPress={() => setShowResults(false)} size={"smallIcon"} variant={"destructive"}>
                <X size={18} className="text-destructive-foreground" />
            </Button>}
            {...props}
        />
        <Collapsible collapsed={!showResults || !data.length}>
            <View className="p-1 bg-popover rounded rounded-t-none">
                {data.map((item, index) => <View key={index}>
                    <Button className="flex-row justify-start" variant={"base"} size={"none"} onPress={() => {
                        props.setCurrentItem(item)
                        setSearchText(getTitle(item))
                        setShowResults(false)
                    }}>
                        <RenderItem {...item} />
                    </Button>
                    {index !== data.length - 1 && <Separator className="my-1" />}
                </View>)}
            </View>
        </Collapsible>
    </View >
}

export type RenderRoomTileProps = Pick<Room, "id" | "avatar" | "title">
export type RenderUserTileProps = Pick<User, "id" | "avatar" | "first_name" | "last_name">
export type RenderCompanyTileProps = Pick<Company, "id" | "avatar" | "title">
export type RenderListingTileProps = Pick<Listing, "id" | "title"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "plan"> }

const RenderRoomTile = (props: RenderRoomTileProps & { currentId: string | undefined }) => {
    return <View className={cn("flex-row p-2 rounded gap-4 items-center", props.currentId === props.id && "bg-popover flex-1 w-full")}>
        <Image source={{ uri: buildAssetUrl(props.avatar) }} className="w-6 h-6 rounded-full" />
        <Text className="font-normal text-sm">{props.title}</Text>
    </View>
}

const RenderListingTile = (props: RenderListingTileProps & { currentId: string | undefined }) => {
    return <View className="flex-col p-2 gap-2 items-start">
        <Text className="!font-normal !text-base">{props.title}</Text>
        <UserChip user={{ ...props.user_created }} />
    </View>
}

const RenderUserTile = (props: RenderUserTileProps & { currentId: string | undefined }) => {
    return <View className={cn("flex-row p-2 rounded gap-4 items-center", props.currentId === props.id && "bg-popover flex-1 w-full")}>
        <Image source={{ uri: buildAssetUrl(props.avatar) }} className="w-6 h-6 rounded-full" />
        <Text className="font-normal text-sm">{props.first_name} {props.last_name}</Text>
    </View>
}

const RenderCompanyTile = (props: RenderCompanyTileProps & { currentId: string | undefined }) => {
    return <View className={cn("flex-row p-2 rounded gap-4 items-center", props.currentId === props.id && "bg-popover flex-1 w-full")}>
        <Image source={{ uri: buildAssetUrl(props.avatar) }} className="w-6 h-6 rounded-full" />
        <Text className="font-normal text-sm">{props.title}</Text>
    </View>
}

const RenderAmenityTile = (props: Amenity & { currentId: number | undefined }) => {
    const { colors } = useColorScheme()

    return <View className={cn("flex-row p-2 rounded gap-4 items-center", props.currentId === props.id && "bg-popover flex-1 w-full")}>
        <MaterialSymbolIcon name={props.icon} fill={colors.foreground} width={24} height={24} />
        <Text className="font-normal text-sm">{props.label}</Text>
    </View>
}