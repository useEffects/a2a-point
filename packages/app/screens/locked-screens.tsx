import { Header } from "app/components/header";
import { ArrowUpRight } from "app/components/icons";
import { Button, ButtonProps } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import useRouting from "app/hooks/use-routing";
import { cn } from "app/lib/utils";
import * as Linking from "expo-linking";
import { ReactNode } from "react";
import { View } from "react-native";

type LockedScreenProps = {
    className?: string,
    SVGComponent: ReactNode,
    title: string,
    readMoreLink: string,
    header: string,
}

export default function LockedScreen(props: LockedScreenProps) {
    return <View className={cn("flex-col gap-4 flex-1 h-screen native:h-auto", props.className)}>
        <Header>
            <Text className="text-xl font-bold">{props.header}</Text>
        </Header>
        <View className="flex-1 flex-col gap-12 p-4">
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
        <View className="flex-col gap-1 p-4">
            <Text className="text-destructive text-center">Locked screen! Login to unlock</Text>
            <GoToLoginButton />
        </View>
    </View>
}

export const GoToLoginButton = (props: ButtonProps) => {
    const goToLogin = useRouting("login")

    return <Button onPress={goToLogin} variant={"default"} size={"default"} className="flex-row items-center" {...props}>
        <Text>Take me to login screen</Text>
        <ArrowUpRight className="text-primary-foreground" />
    </Button>
}

