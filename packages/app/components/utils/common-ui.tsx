import { ComponentType } from "react"
import { ButtonProps } from "../ui/button"
import { Text } from "../ui/text"
import { ArrowUpRight } from "app/components/icons"

export const ViewAllButton = ({ button }: { button: ComponentType<ButtonProps> }) => {
    const Component = button
    return <Component variant={"ghost"} size={"none"} className="h-28 w-28 ml-4 flex-col gap-1" >
        <Text className="text-subtext">View all</Text>
        <ArrowUpRight className="text-info" />
    </Component>
}
