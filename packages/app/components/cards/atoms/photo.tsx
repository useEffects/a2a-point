import { GoToFullListingButton } from "app/components/link-buttons";
import { Text } from "app/components/ui/text";
import { UserChip } from "app/components/user-chip";
import { buildAssetUrl } from "app/lib/helpers";
import { Listing, User } from "app/lib/types";
import { Dimensions, Image, View } from "react-native";

export type PhotoListingProps = Pick<Listing, "id" | "title" | "budget" | "deal_type" | "photo_1" | "photo_2" | "photo_3"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "plan"> }

export const PhotoListingCard = (item: PhotoListingProps) => {
    const photo = item.photo_1 || item.photo_2 || item.photo_3
    const windowWidth = Dimensions.get('window').width
    const imageWidth = windowWidth / 2
    const imageHeight = (9 / 16) * imageWidth
    return <GoToFullListingButton listingId={item.id} className="rounded-xl bg-card text-wrap">
        <Image source={{ uri: buildAssetUrl(photo) }} width={imageWidth} height={imageHeight} className="rounded-tl-xl rounded-tr-xl" />
        <View className="bg-card flex-col gap-2 px-2 py-4 items-start" style={{ width: imageWidth - 8 }}>
            <UserChip user={item.user_created} />
            <Text className="text-wrap" style={{ width: imageWidth }}>{item.title}</Text>
            <View className="flex-row gap-4 justify-between w-full">
                <Text className="text-success">AED {item.budget.toLocaleString()}</Text>
                <Text className="capitalize text-info">{item.deal_type}</Text>
            </View>
        </View>
    </GoToFullListingButton>
}