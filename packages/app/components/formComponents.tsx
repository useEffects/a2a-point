/* eslint-disable react/display-name */
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import { ComponentPropsWithoutRef, Dispatch, ReactNode, SetStateAction, forwardRef, useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { SelectRootProps } from "./primitives/select/types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Text } from "./ui/text";
import { set } from "fp-ts";

type AdditionalFromInputProps = {
    error?: string,
    label?: string,
    maxLines?: number
}

export const initialInputHeight = 40

export const FormInput = (props: TextInputProps & AdditionalFromInputProps) => {
    const { error, label, maxLines = 4, ...rest } = props
    const [height, setHeight] = useState(initialInputHeight)
    const { colors } = useColorScheme()

    const handleSizeChange = (newHeight: number) => {
        if (newHeight <= initialInputHeight * maxLines && newHeight >= initialInputHeight) {
            setHeight(newHeight)
        }
    }

    return <View className="flex-col gap-2 w-full">
        <Text className={cn("text-sm", error?.length ? "text-destructive" : "text-subtext")}>{label}</Text>
        <Input
            {...rest}
            style={{ height, borderColor: error?.length ? colors.destructive : colors.border }}
            onContentSizeChange={e => handleSizeChange(e.nativeEvent.contentSize.height)}
            multiline
        />
        {error ? <Text className="text-destructive text-xs">{error}</Text> : <></>}
    </View>
}

type AdditionalFormSelectProps = {
    label?: string,
    error?: string,
    placeholder?: string,
    options: { value: string, label: string }[],
    customSelectValue?: ReactNode
}

export const FormSelect = (props: SelectRootProps & AdditionalFormSelectProps) => {
    const { error, label, placeholder, options, ...rest } = props
    return <View className="flex-col gap-2">
        <Text className={cn("text-sm", error?.length ? "text-destructive" : "text-subtext")}>{label}</Text>
        <Select open>
            <SelectTrigger className={cn(error ? "border-destructive" : "border-border")}>
                {props.customSelectValue ? props.customSelectValue :
                    <SelectValue className="text-foreground font-normal" placeholder={props.value?.value ?? ""} />}
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

type AdditionalAutoSelectFormProps = {
    searchText: string,
    setSearchText: Dispatch<SetStateAction<string>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}

export const FormAutoSelect = (props: SelectRootProps & AdditionalFormSelectProps & AdditionalAutoSelectFormProps) => {
    console.log(props.options)
    return <>
        <FormSelect
            options={props.options}
            label={props.label}
            error={props.error}
            // open={props.open}
            // onOpenChange={props.setOpen}
            customSelectValue={<Input
                className="bg-card pl-0 border-0"
                value={props.searchText}
                onChangeText={props.setSearchText}
                placeholder={props.placeholder}
                style={{ borderColor: props.error ? "red" : undefined }}
            />}
        />
    </>
}