import { Text } from "app/components/ui/text";
import useRouting from "app/hooks/use-routing";
import { Listing } from "app/lib/types";
import { Pressable, View } from "react-native";

export type ExtraSmallListingCardProps = Pick<Listing, "id" | "title" | "budget">

export const ExtraSmallListingCard = (props: ExtraSmallListingCardProps) => {
    const goToListingDetailed = useRouting("listing-detailed")
    return <Pressable onPress={() => goToListingDetailed(props.id)} className="flex-col items-start w-full p-4">
        <Text className="">{props.title}</Text>
        <View className="flex-row items-center justify-between w-full">
            <Text className="!text-success w-[120px]">AED {Number(props.budget).toLocaleString()}</Text>
        </View>
    </Pressable>
}