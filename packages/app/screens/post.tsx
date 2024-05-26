import PostListing from "app/components/post-listing";
import { Text } from "app/components/ui/text";
import PostSVG from "app/components/svg/post";
import { View } from "react-native";
import { GoToLoginButton } from "app/components/utils";
import { cn } from "app/lib/utils";
import { ArrowUpRight } from "app/components/icons";
import { Button } from "app/components/ui/button";

export function PostScreenComponent() {
    return <View className="flex-col gap-4 flex-1">
        <Text className="text-xl font-bold">Post a new listing</Text>
        <PostListing />
    </View>
}

export function PostScreenComponentFallBack({ className }: { className?: string }) {
    return <View className={cn("p-4 flex-col gap-4 flex-1", className)}>
        <View className="flex-1 flex-col justify-evenly">
            <View className="flex-col">
                <Text className="text-xl text-center font-medium">Create and manage property listings on A2APoint</Text>
                <Button variant={"base"} size={"none"} className="flex-row">
                    <Text className="text-info underline">Learn more</Text>
                </Button>
            </View>
            <View className="w-full flex-row justify-center">
                <Text></Text>
                <View className="bg-popover p-4 rounded-full">
                    <PostSVG width={300} height={300} />
                </View>
            </View>
        </View>
        <View className="flex-col gap-1">
            <Text className="text-destructive text-center">Locked screen! Login to unlock</Text>
            <GoToLoginButton variant={"default"} size={"default"} className="flex-row items-center">
                <Text>Take me to login screen</Text>
                <ArrowUpRight className="text-primary-foreground" />
            </GoToLoginButton>
        </View>
    </View>
}

