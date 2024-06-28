import PostSVG from "app/components/svg/post";
import LockedScreen from "app/screens/locked-screens";
import PostScreenComponent from "app/screens/post";
import directusStore from "app/store/directus";
import { View } from "react-native";

export default function PostScreen() {
    const { authenticated } = directusStore();

    return <View className="flex-1">
        {authenticated ? <View className="p-4 flex-1">
            <PostScreenComponent />
        </View> : <LockedScreen
            SVGComponent={<PostSVG width={300} height={300} />}
            readMoreLink="https://a2apoint.com"
            title="Create and manage property listings on A2APoint"
            header="Post"
        />}
    </View>
}