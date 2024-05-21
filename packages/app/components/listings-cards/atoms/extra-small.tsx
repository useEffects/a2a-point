import { Text } from "app/components/ui/text";
import { Listing } from "app/lib/types";
import { View } from "react-native";
import { GoToFullListingButton } from "app/components/utils";

export type ExtraSmallListingCardProps = Pick<Listing, "id" | "title" | "type" | "price">

export const ExtraSmallListingCard = (props: ExtraSmallListingCardProps) => {
    return <GoToFullListingButton listingId={props.id} variant={"ghost"} size={"none"} className="flex-col items-start w-full p-4">
        <Text className="">{props.title}</Text>
        <View className="flex-row items-center justify-between w-full">
            <Text className="!text-success w-[120px]">AED {Number(props.price).toLocaleString()}</Text>
            <Text className="!text-info text-sm capitalize">{props.type}</Text>
        </View>
    </GoToFullListingButton>
}