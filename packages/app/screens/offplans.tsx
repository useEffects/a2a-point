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
            <Text className="text-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae, vero!</Text>
            <Text className="text-success text-lg font-medium">Coming Soon</Text>
        </View>
    </View>
}