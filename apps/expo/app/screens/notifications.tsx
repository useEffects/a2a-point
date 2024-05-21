import { Text } from "app/components/ui/text";
import { View } from "react-native";
import NotificationsList from "app/components/notifications"
import { Header } from "app/components/header";

export default function NotificationsScreen() {
    return <View className="flex-1">
        <Header>
            <Text>Notifications</Text>
        </Header>
        <NotificationsList />
    </View>
}