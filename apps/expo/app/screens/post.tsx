import { ScrollView, View } from "react-native";
import PostListing from "app/components/post-listing";
import { Text } from "app/components/ui/text";

export default function PostScreen() {
    return <View className="m-4 flex-col gap-4 flex-1">
        <Text className="text-xl font-bold">Post a new listing</Text>
        <PostListing />
    </View>
}