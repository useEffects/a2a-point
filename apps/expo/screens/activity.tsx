import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import useNavigation from "app/hooks/navigation";
import ActivityScreenComponent from "app/screens/activity";
import { useEffect } from "react";
import { View } from "react-native";

export default function ActivityScreen() {
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
            header: () => <Header>
                <Text className="text-xl font-bold">Your activity</Text>
            </Header>
        })
    }, [navigation])

    return <View className="flex-1">
        <ActivityScreenComponent />
    </View>
}