import { Header, HeaderTitle } from "app/components/header";
import { ArrowUpRight } from "app/components/icons";
import { Button, ButtonProps } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import useRouting from "app/hooks/use-routing";
import { cn } from "app/lib/utils";
import { ReactNode } from "react";
import { Dimensions, Platform, View } from "react-native";
import { SolitoImage as Image } from "solito/image"

type LockedScreenProps = {
    className?: string,
    image: any,
    headerTitle: string,
    header?: () => ReactNode,
    title: string,
    description: string,
    bottomComponent?: () => ReactNode
}

export default function LockedScreen(props: LockedScreenProps) {
    const { width } = Dimensions.get("window")
    const { isDarkColorScheme } = useColorScheme()
    const Bottom = props.bottomComponent
    const FinalHeader = props.header

    const dimensions = Platform.select({
        web: {
            width: "100%",
            height: "100%"
        },
        default: {
            width: width,
            height: width * (16 / 9)
        }
    })

    return <View className="flex-1 relative h-screen">
        {/** @ts-ignore */}
        <View className="absolute top-0 left-0 bottom-0 right-0" style={dimensions}>
            {/** @ts-ignore */}
            <Image src={props.image} width={dimensions.width} height={dimensions.height} alt="locked screen bg" />
        </View>
        <View style={{ opacity: 0.9 }} className={cn("absolute top-0 left-0 bottom-0 right-0", isDarkColorScheme ? "bg-black" : "bg-white")} />
        {FinalHeader ? <FinalHeader /> : <Header>
            <HeaderTitle>{props.headerTitle}</HeaderTitle>
        </Header>}
        <View className="flex-grow px-4 flex-col justify-center max-w-md mx-auto">
            <View className="flex-col gap-4">
                <Text className="text-2xl font-bold text-primary text-center">{props.title}</Text>
                <Separator />
                <Text className="text-subtext text-center">{props.description}</Text>
            </View>
        </View>
        {Bottom ? <Bottom /> : <View className="p-4 w-full md:max-w-sm mx-auto native:max-w-none">
            <GoToLoginComponent />
        </View>}
    </View>
}

export const GoToLoginButton = (props: ButtonProps) => {
    const goToLogin = useRouting("login")

    return <Button onPress={goToLogin} variant={"default"} size={"default"} className="flex-row items-center w-full" {...props}>
        <Text>Take me to login screen</Text>
        <ArrowUpRight className="text-primary-foreground" />
    </Button>
}

export const GoToLoginComponent = () => {
    const { colors } = useColorScheme()

    return <View className="flex-col gap-1 w-full">
        <Text className="text-sm text-center text-destructive">Locked screen! Login to unlock</Text>
        <GoToLoginButton />
    </View>
}

