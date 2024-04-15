import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Listing } from "~/types";
import { OpenDetailsButton } from "./small";

export type ExtraSmallListingCardProps = Pick<Listing, "id" | "title" | "type" | "price">

export const ExtraSmallListingCard = (props: ExtraSmallListingCardProps) => {
    return <View className="flex-col">
        <Text>{props.title}</Text>
        <View className="flex-row items-center justify-between">
            <View className="flex-row gap-2">
                <Text className="text-success">AED {Number(props.price).toLocaleString()}</Text>
                <Text className="text-info">{props.type}</Text>
            </View>
            <OpenDetailsButton id={props.id} size="sm" />
        </View>
    </View>
}