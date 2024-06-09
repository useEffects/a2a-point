/* eslint-disable react/display-name */
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from "react";
import { DimensionValue, Image, TextInputProps, View } from "react-native";
import { SelectRootProps } from "./primitives/select/types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Text } from "./ui/text";
import { Formik, FormikProps } from "formik";
import AutoComplete from "react-native-autocomplete-input"
import { useQuery } from "@tanstack/react-query";
import directusStore from "app/store/directus";
import { readItems } from "@directus/sdk";
import { Company, Listing, Room, User } from "app/lib/types";
import { buildAssetUrl } from "app/lib/helpers";
import { UserChip } from "./user-chip";
import { useDebounce } from "use-debounce";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { directusUrl } from "app/lib/constants";
import OutsidePressHandler from 'react-native-outside-press';
import Collapsible from "react-native-collapsible";
import { set } from "lodash";
import { FlatList } from "./utils/virtual-lists";
import { ChevronDown, ChevronUp } from "app/components/icons";

type AdditionalFormInputProps = {
    error?: string,
    label?: string,
    maxLines?: number,
    initialHeight?: DimensionValue
}

export const initialInputHeight = 40

export const FormInput = (props: TextInputProps & AdditionalFormInputProps) => {
    const { error, label, maxLines = 4, ...rest } = props
    const [height, setHeight] = useState<DimensionValue>(props.initialHeight ?? initialInputHeight)
    const { colors } = useColorScheme()

    const handleSizeChange = (newHeight: number) => {
        if (newHeight <= initialInputHeight * maxLines && newHeight >= initialInputHeight) {
            setHeight(newHeight)
        }
    }

    return <View className="flex-col gap-2 w-full">
        {props.label && <Text className={cn("text-sm", error?.length ? "text-destructive" : "text-subtext")}>{label}</Text>}
        <Input
            {...rest}
            style={{ height, borderColor: error?.length ? colors.destructive : colors.border }}
            onContentSizeChange={e => handleSizeChange(e.nativeEvent.contentSize.height)}
            multiline
            className="text-base"
        />
        {error && <Text className="text-destructive text-xs">{error}</Text>}
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

export type AutoCompleteRenderItemProps = RenderListingTileProps | RenderRoomTileProps | RenderUserTileProps | RenderCompanyTileProps

const autoCompleteFields = {
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


export const FormAutoSelect = (props: TextInputProps & AdditionalFormInputProps & AdditionalAutoSelectFormProps) => {
    const isRenderUserTile = (item: AutoCompleteRenderItemProps | undefined): item is RenderUserTileProps => {
        return props.item === "users"
    }
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
        if (!props.currentItem) return null
        if (isRenderUserTile(props.currentItem)) {
            return props.currentItem ? `${props.currentItem.first_name} ${props.currentItem.last_name}` : ""
        } else {
            return props.currentItem?.title
        }
    }, [props.currentItem])

    const { rest, token } = directusStore()
    const [searchText, setSearchText] = useState(title ?? "")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [showResults, setShowResults] = useState(false)


    const { data } = useQuery<AutoCompleteRenderItemProps[]>({
        queryKey: ["Fetch AutoComplete Data", props.item, debouncedSearchText],
        queryFn: async () => props.item === "users" ?
            await fetch(`${directusUrl}/users/?filter=${props.filter || ""}&limit=5&search=${debouncedSearchText}&fields=${autoCompleteFields[props.item].join(",")}`, {
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
            return <RenderUserTile {...item} currentId={props.currentItem?.id} />
        }
        if (isRenderCompanyTile(item)) {
            return <RenderCompanyTile {...item} currentId={props.currentItem?.id} />
        }
        if (isRenderRoomTile(item)) {
            return <RenderRoomTile {...item} currentId={props.currentItem?.id} />
        }
        if (isRenderListingTile(item)) {
            return <RenderListingTile {...item} currentId={props.currentItem?.id} />
        }
    }
    return <View className="w-full">
        <View className="flex-row">
            <FormInput
                label={props.label}
                error={props.error}
                value={searchText}
                onChangeText={handleChange}
                onFocus={() => setShowResults(true)}
            />
        </View>
        <Collapsible collapsed={!showResults}>
            <OutsidePressHandler onOutsidePress={() => setShowResults(false)}>
                <View className="p-1 bg-popover rounded">
                    {data.map((item, index) => <View key={index}>
                        <Button className="flex-row justify-start" variant={"base"} size={"none"} onPress={() => {
                            props.setCurrentItem(item)
                            setSearchText(isRenderUserTile(item) ? `${item.first_name} ${item.last_name}` : item.title!)
                            setShowResults(false)
                        }}>
                            <RenderItem {...item} />
                        </Button>
                        {index !== data.length - 1 && <Separator className="my-1" />}
                    </View>)}
                </View>
            </OutsidePressHandler>
        </Collapsible>
    </View>
}

export type RenderRoomTileProps = Pick<Room, "id" | "avatar" | "title">
export type RenderUserTileProps = Pick<User, "id" | "avatar" | "first_name" | "last_name">
export type RenderCompanyTileProps = Pick<Company, "id" | "avatar" | "title">
export type RenderListingTileProps = Pick<Listing, "id" | "title"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name"> }

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