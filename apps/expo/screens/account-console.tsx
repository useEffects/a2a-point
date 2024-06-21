import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import { AccountConsoleScreenComponent } from "app/screens/account-console";
import { View } from "react-native";

export default function AccountConsoleScreen() {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Account console</Text>
        </Header>
        <View className="flex-1">
            <AccountConsoleScreenComponent />
        </View>
    </View>
}