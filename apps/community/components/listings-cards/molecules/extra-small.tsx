import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Listing } from "~/types";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";

export type ExtraSmallListingCardProps = Pick<Listing, "id" | "title" | "type" | "price">

export const ExtraSmallListingCard = (props: ExtraSmallListingCardProps) => {
    return <Button onPress={() => router.push(`/${props.id}`)} variant={"ghost"} size={"none"} className="flex-col items-start w-full p-4">
        <Text className="">{props.title}</Text>
        <View className="flex-row items-center justify-between w-full">
            <Text className="!text-success w-[120px]">AED {Number(props.price).toLocaleString()}</Text>
            <Text className="!text-info text-sm capitalize">{props.type}</Text>
        </View>
    </Button>
}