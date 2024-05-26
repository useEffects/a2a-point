import { Text } from "app/components/ui/text";
import { View } from "react-native";
import NotificationsList from "app/components/notifications"
import { Header } from "app/components/header";
import directusStore from "app/store/directus";
import LockedScreen from "app/screens/locked-screens";
import NotificationsSVG from "app/components/svg/notifications";

export default function NotificationsScreen() {
    const { authenticated } = directusStore();
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Notifications</Text>
        </Header>
        {authenticated ? <NotificationsList /> : <LockedScreen
            SVGComponent={<NotificationsSVG width={300} height={300} />}
            readMoreLink="https://a2apoint.com"
            title="Never miss an update from A2APoint! Get notified about new bookmarks received on your listing, messages and more."
        />}
    </View>
}