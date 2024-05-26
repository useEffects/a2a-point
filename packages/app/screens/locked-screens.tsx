import { Text } from "app/components/ui/text";
import PostSVG from "app/components/svg/post";
import { View } from "react-native";
import { GoToLoginButtonProps, GoToLoginButton as LoginButton } from "app/components/utils";
import { cn } from "app/lib/utils";
import { ArrowUpRight } from "app/components/icons";
import { Button, ButtonProps } from "app/components/ui/button";
import { ReactNode } from "react";
import { TopTabParamList } from "app/lib/misc/navigation";
import * as Linking from "expo-linking";

type LockedScreenProps = {
    className?: string,
    SVGComponent: ReactNode,
    title: string,
    readMoreLink: string,
}

export default function LockedScreen(props: LockedScreenProps) {
    return <View className={cn("p-4 flex-col gap-4 flex-1", props.className)}>
        <View className="flex-1 flex-col gap-12 my-12">
            <View className="flex-col">
                <Text className="text-xl text-center font-medium">{props.title}</Text>
                <Button variant={"base"} size={"none"} className="flex-row" onPress={() => Linking.openURL(props.readMoreLink)}>
                    <Text className="text-info underline">Learn more</Text>
                </Button>
            </View>
            <View className="w-full flex-row justify-center">
                <Text></Text>
                <View className="bg-popover p-4 rounded-full">
                    {props.SVGComponent}
                </View>
            </View>
        </View>
        <View className="flex-col gap-1">
            <Text className="text-destructive text-center">Locked screen! Login to unlock</Text>
            <GoToLoginButton />
        </View>
    </View>
}

export const GoToLoginButton = (props: GoToLoginButtonProps) => <LoginButton variant={"default"} size={"default"} className="flex-row items-center" {...props}>
    <Text>Take me to login screen</Text>
    <ArrowUpRight className="text-primary-foreground" />
</LoginButton>

