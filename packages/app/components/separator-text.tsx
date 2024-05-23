import { View } from "react-native"
import { Separator } from "./ui/separator"
import { SeparatorRootProps } from "./primitives/separator/types"
import { cn } from "app/lib/utils"
import { ReactNode } from "react"

export const SeparatorText = (props: { wrapperClassName?: string, separatorProps?: SeparatorRootProps, children: ReactNode }) => {
    return <View className={cn("flex-1 flex-row w-full gap-4 items-center", props.wrapperClassName)}>
        <Separator {...props.separatorProps} className="flex-1" />
        {props.children}
        <Separator {...props.separatorProps} className="flex-1" />
    </View>
}