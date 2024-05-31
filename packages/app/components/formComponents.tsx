/* eslint-disable react/display-name */
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
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
import { Listing, Room, User } from "app/lib/types";
import { buildAssetUrl } from "app/lib/helpers";
import { UserChip } from "./user-chip";
import { useDebounce } from "use-debounce";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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

export type AutoCompleteRenderItemProps = RenderListingTileProps | RenderRoomTileProps

const autoCompleteFields = {
    "rooms": ["id", "title", "avatar"],
    "listings": ["id", "title", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name"]
}

type AdditionalAutoSelectFormProps = {
    item: keyof typeof autoCompleteFields,
    currentItem: AutoCompleteRenderItemProps | null,
    setCurrentItem: (item: AutoCompleteRenderItemProps | null) => void,
    filter: Record<string, any>,
    initialValue?: AutoCompleteRenderItemProps
}

export const FormAutoSelect = (props: TextInputProps & AdditionalFormInputProps & AdditionalAutoSelectFormProps) => {
    const { colors } = useColorScheme()
    const { rest } = directusStore()
    const [searchText, setSearchText] = useState(props.initialValue?.title || "")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const [hideResults, setHideResults] = useState(true)

    const { data } = useQuery<AutoCompleteRenderItemProps[]>({
        queryKey: ["Fetch AutoComplete Data", props.value, props.item, debouncedSearchText],
        queryFn: async () => rest.request(readItems(props.item, {
            filter: props.filter,
            search: debouncedSearchText,
            fields: autoCompleteFields[props.item],
            limit: 5
        })) as Promise<(AutoCompleteRenderItemProps)[]>,
        initialData: [],
    })

    const handleChange = (val: string) => {
        props.setCurrentItem(null)
        setSearchText(val)
        setHideResults(false)
    }

    const isRenderRoomTile = (item: RenderRoomTileProps | RenderListingTileProps): item is RenderRoomTileProps => {
        return props.item === "rooms"
    }

    const RenderItem = (item: RenderRoomTileProps | RenderListingTileProps) => {
        return isRenderRoomTile(item) ? <RenderRoomTile {...item} currentId={props.currentItem?.id} /> : <RenderListingTile {...item} currentId={props.currentItem?.id} />
    }
    return <View className="relative w-full" style={{ height: initialInputHeight + 32 }}>
        <View style={{zIndex: 100, position: "absolute", elevation: 100, left: 0, right: 0, top: 0}}>
            <AutoComplete
                data={data}
                renderTextInput={() => <FormInput
                    value={searchText}
                    label={props.label}
                    onChangeText={handleChange}
                    onFocus={() => setHideResults(false)}
                    onBlur={() => setHideResults(true)}
                />}
                hideResults={hideResults}
                inputContainerStyle={{ borderWidth: 0 }}
                containerStyle={{ borderWidth: 0 }}
                flatListProps={{
                    scrollEnabled: false,
                    renderItem: ({ item }) => <Button
                        className="items-start"
                        onPress={() => {
                            props.setCurrentItem(item)
                            setSearchText(item.title!)
                            setHideResults(true)
                        }}
                        variant={"base"}
                        size={"none"}
                    >
                        <RenderItem {...item} />
                    </Button>,
                    style: { borderWidth: 0, backgroundColor: colors.card, margin: 0, borderRadius: 8, padding: 8 },
                    ItemSeparatorComponent: () => <Separator className="my-2 px-4" />,
                    keyboardShouldPersistTaps: "handled"
                }}
            />
        </View>
    </View>
}

export type RenderRoomTileProps = Pick<Room, "id" | "avatar" | "title">
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