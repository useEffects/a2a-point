import { Separator } from "app/components/ui/separator"
import Construction from "app/components/svg/construction";
import { Text } from "app/components/ui/text";
import { View } from "react-native";

export function OffPlans() {
    return <View className="flex-1 flex-col items-center justify-center gap-8">
        <View className="rounded-full bg-popover p-4">
            <Construction width={300} height={300} />
        </View>
        <Separator />
        <View className="px-4 flex-col items-center gap-4">
            <Text className="text-center">Streamline your property sales with A2A POINT. Find curated UAE off-plan listings (global coming soon!) and craft personalized presentations in one click. Boost efficiency, impress clients, and close more deals.</Text>
            <Text className="text-success text-lg font-medium">Coming Soon</Text>
        </View>
    </View>
}