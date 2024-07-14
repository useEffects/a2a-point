import PostSVG from "app/components/svg/post";
import LockedScreen from "app/screens/locked-screens";
import PostScreenComponent from "app/screens/post";
import directusStore from "app/store/directus";
import { View } from "react-native";

export default function PostScreen() {

    return <View className="flex-1">
        <PostScreenComponent />
    </View>
}