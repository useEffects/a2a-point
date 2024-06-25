import { Header } from "app/components/header";
import NotificationsList from "app/components/notifications";
import { Text } from "app/components/ui/text";
import { View } from "react-native";

export default function NotificationsScreen() {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-semibold">Notifications</Text>
        </Header>
        <NotificationsList />
    </View>
}