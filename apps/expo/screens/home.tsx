import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import { ScrollView } from "app/components/utils/virtual-lists";
import HomeScreenComponent from "app/screens/home";
import { View } from "react-native";

export default function HomeScreen() {
    return <ScrollView className="flex-col flex-1" contentContainerClassName="gap-4">
        <Header>
            <Text className="text-xl font-semibold">A2APoint</Text>
        </Header>
        <View className="flex-1 pb-8">
            <HomeScreenComponent />
        </View>
    </ScrollView>
}