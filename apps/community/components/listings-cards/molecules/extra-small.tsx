import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Listing } from "~/types";
import { OpenDetailsButton } from "./small";

export type ExtraSmallListingCardProps = Pick<Listing, "id" | "title" | "type" | "price">

export const ExtraSmallListingCard = (props: ExtraSmallListingCardProps) => {
    return <View className="flex-col">
        <Text className="">{props.title}</Text>
        <View className="flex-row items-center justify-between">
            <Text className="text-success w-[120px]">AED {Number(props.price).toLocaleString()}</Text>
            <Text className="text-info text-sm capitalize">{props.type}</Text>
            <OpenDetailsButton id={props.id} size="sm" />
        </View>
    </View >
}