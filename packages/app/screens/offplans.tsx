import { Separator } from "app/components/ui/separator"
import Construction from "app/components/svg/construction";
import { Text } from "app/components/ui/text";
import { Dimensions, View } from "react-native";
import { Header } from "app/components/header";
import OffPlansSVG from "app/components/svg/offplans";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "app/components/ui/card";

export default function OffPlans() {
    const { width } = Dimensions.get("window")

    return <View className="flex-1 relative">
        <View className="absolute top-0 left-0 right-0 bottom-0">
            <OffPlansSVG width={width} height={width * (16 / 9)} />
        </View>
        <Header>
            <Text className="text-xl font-bold">Off plans</Text>
        </Header>
        <View className="flex-grow p-4">
            <Card className="self-start">
                <CardHeader>
                    <CardTitle>Offplans coming soon!</CardTitle>
                </CardHeader>
                <CardContent className="px-4 flex-col items-center gap-4">
                    <Text>Streamline your property sales with A2A POINT. Find curated UAE off-plan listings (global coming soon!) and craft personalized presentations in one click. Boost efficiency, impress clients, and close more deals.</Text>
                </CardContent>
            </Card>
            <View className="mt-auto bg-success h-10 native:h-12 rounded flex-col justify-center">
                <Text className="text-success-foreground text-center font-medium">Coming soon</Text>
            </View>
        </View>
    </View>
}

<View className="p-4 flex-1 flex-col gap-8">
    <View className="rounded-full bg-popover p-4">
        <Construction width={300} height={300} />
    </View>
    <Separator />
</View>