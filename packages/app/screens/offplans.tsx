import { Separator } from "app/components/ui/separator"
import Construction from "app/components/svg/construction";
import { Text } from "app/components/ui/text";
import { View } from "react-native";
import { Header } from "app/components/header";

export default function OffPlans() {
    return <View className="flex-1 flex-col gap-8">
        <Header>
            <Text className="text-xl font-bold">Off plans</Text>
        </Header>
        <View className="p-4 flex-1 flex-col gap-8">
            <View className="rounded-full bg-popover p-4">
                <Construction width={300} height={300} />
            </View>
            <Separator />
            <View className="px-4 flex-col items-center gap-4">
                <Text className="text-center">Streamline your property sales with A2A POINT. Find curated UAE off-plan listings (global coming soon!) and craft personalized presentations in one click. Boost efficiency, impress clients, and close more deals.</Text>
                <Text className="text-success text-lg font-medium">Coming Soon</Text>
            </View>
        </View>
    </View>
}