import { TextInputProps } from "react-native";
import { Input } from "./ui/input";
import { View } from "react-native";
import { Text } from "./ui/text";
import { useState } from "react";
import { useColorScheme } from "app/hooks/color-scheme";

type AdditionalTextFieldProps = {
    error?: string,
    label?: string,
    maxLines?: number
}

export const initialInputHeight = 40

export const TextField = (props: TextInputProps & AdditionalTextFieldProps) => {
    const { error, label, maxLines = 4, ...rest } = props
    const [height, setHeight] = useState(initialInputHeight)
    const { colors } = useColorScheme()

    const handleSizeChange = (newHeight: number) => {
        if (newHeight <= initialInputHeight * maxLines && newHeight >= initialInputHeight) {
            setHeight(newHeight)
        }
    }

    return <View className="flex-col gap-2">
        <Text className="text-sm">{label}</Text>
        <Input
            {...rest}
            style={{ height }}
            onContentSizeChange={e => handleSizeChange(e.nativeEvent.contentSize.height)}
            cursorColor={colors.primary}
        />
        {error ? <Text className="text-destructive text-xs">{error}</Text> : <></>}
    </View>
}