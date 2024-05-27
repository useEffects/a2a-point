import { useColorScheme } from "app/hooks/color-scheme"
import useNavigation from "app/hooks/navigation"
import { X } from "lucide-react-native"
import { GestureResponderEvent } from "react-native"
import { Button, ButtonProps } from "../ui/button"

export const CloseButton = (props: ButtonProps) => {
    const { colors } = useColorScheme()
    return (
        <Button variant={"base"} size={"none"} style={{ backgroundColor: colors.destructive }} className="p-1 rounded" {...props}>
            <X size={14} color={colors["destructive-foreground"]} />
        </Button>
    )
}

export const GoToFullListingButton = (props: ButtonProps & { listingId: string }) => {
    const navigation = useNavigation()

    const goToDetailScreen = () => {
        navigation.getState() && navigation.navigate("listing-detailed", {
            id: props.listingId
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToRoomButton = (props: ButtonProps & { roomId: string | Promise<string> }) => {
    const navigation = useNavigation()

    const goToDetailScreen = async () => {
        const id = await props.roomId
        navigation.getState() && navigation.navigate("room-detailed", {
            id
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToProfileButton = (props: ButtonProps & { userId: string, additionalOnPress?: () => void }) => {
    const navigation = useNavigation()

    const goToProfileDetailed = () => {
        props.additionalOnPress && props.additionalOnPress()
        navigation.getState() && navigation.navigate("profile-detailed", {
            id: props.userId
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToProfileDetailed} {...props} />
}

export const GoToLocationListingsButton = (props: ButtonProps & { roomId: string }) => {
    const navigation = useNavigation()

    const goToLocationDetailed = () => {
        navigation.getState() && navigation.navigate("location-listings", {
            id: props.roomId
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToLocationDetailed} {...props} />
}

export const GoToPostFeedbackButton = (props: ButtonProps & { agentId: string, feedbackId?: string }) => {
    const navigation = useNavigation()

    const goToPostFeedback = () => {
        navigation.getState() && navigation.navigate("post-feedback", {
            id: props.agentId,
            feedbackId: props.feedbackId?.toString()
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToPostFeedback} {...props} />
}

export type GoToLoginButtonProps = ButtonProps & { additionalOnPress?: () => void }
export const GoToLoginButton = (props: GoToLoginButtonProps) => {
    const navigation = useNavigation()

    const goToLogin = () => {
        navigation.getState() && navigation.navigate("login")
    }

    const handleOnPress = (e: GestureResponderEvent) => {
        props.additionalOnPress && props.additionalOnPress()
        goToLogin()
    }

    return <Button variant={"base"} size={"none"} onPress={handleOnPress} {...props} />
}