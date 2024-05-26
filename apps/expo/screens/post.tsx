import directusStore from "app/store/directus";
import { PostScreenComponent, PostScreenComponentFallBack } from "app/screens/post";
import { Text } from "app/components/ui/text";
import { View } from "react-native";
import { Header } from "app/components/header";
import LockedScreen from "app/screens/locked-screens";
import PostSVG from "app/components/svg/post";

export default function PostScreen() {
    const { authenticated } = directusStore();

    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Post</Text>
        </Header>
        {authenticated ? <PostScreenComponent /> : <LockedScreen
            SVGComponent={<PostSVG width={300} height={300} />}
            readMoreLink="https://a2apoint.com"
            title="Create and manage property listings on A2APoint"
        />}
    </View>
}