import { ComponentType, useState } from "react"
import { Button, ButtonProps } from "../ui/button"
import { Text } from "../ui/text"
import { ArrowUpRight, Plus } from "app/components/icons"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { View } from "react-native"
import { Separator } from "../ui/separator"
import { cn } from "app/lib/utils"
import useRouting from "app/hooks/use-routing"
import { set } from "lodash"
import { DetailedAmenity } from "app/lib/props"
import { groupByN } from "app/lib/helpers"
import { RenderAmenity } from "app/screens/post"

export const ViewAllButton = ({ button, horizontal }: { button: ComponentType<ButtonProps>, horizontal: boolean }) => {
    const Component = button
    return <Component variant={"ghost"} size={"none"} className={cn("h-28 w-28 flex-col gap-1", horizontal ? "mx-4" : "my-4")}>
        <Text className="text-subtext">View all</Text>
        <ArrowUpRight className="text-info" />
    </Component>
}

export const GoToPostButtonUi = () => {
    const [key, setKey] = useState("Buy")
    const [open, setOpen] = useState(false)
    const goToPost = useRouting("post")

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button size={"icon"} className="rounded-full">
                <Plus size={24} className="text-primary-foreground" />
            </Button>
        </DialogTrigger>
        <DialogContent className="w-[350px]">
            <DialogHeader>
                <DialogTitle>Post a new lead</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Share a property lead with agents. Ensure information is accurate and complete.
            </DialogDescription>
            <View className="flex-row w-full gap-4 flex-wrap justify-start">
                {["Buy", "Sale", "Give on rent", "Take on rent"].map((item, i) => <Button className="self-start" size={"sm"} key={i} variant={item === key ? "secondary" : "outline"} onPress={() => setKey(item)}>
                    <Text>{item}</Text>
                </Button>)}
            </View>
            <Separator />
            <DialogFooter>
                <Button onPress={() => {
                    setOpen(false)
                    goToPost({ key })
                }} className="self-start ml-auto mr-0" size={"sm"} variant={"default"}>
                    <Text>Proceed</Text>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog >
}