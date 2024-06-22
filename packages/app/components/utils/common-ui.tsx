import { ComponentType, useState } from "react"
import { Button, ButtonProps } from "../ui/button"
import { Text } from "../ui/text"
import { ArrowUpRight, Plus } from "app/components/icons"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { View } from "react-native"
import { Separator } from "../ui/separator"
import { GoToPostButton } from "../link-buttons"
import { cn } from "app/lib/utils"

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
            <View className="flex-row w-full gap-4">
                {["Buy", "Sale", "Rent"].map((item, i) => <Button className="flex-grow" size={"sm"} key={i} variant={item === key ? "default" : "outline"} onPress={() => setKey(item)}>
                    <Text>{item}</Text>
                </Button>)}
            </View>
            <Separator />
            <DialogFooter>
                <GoToPostButton additionalOnPress={() => setOpen(false)} type={key === "Buy" ? "buy" : key === "Sale" ? "sale" : "rent"} className="self-start ml-auto mr-0" size={"sm"} variant={"ghost"}>
                    <Text>Proceed</Text>
                </GoToPostButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}