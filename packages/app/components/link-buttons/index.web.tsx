import { Button, ButtonProps } from "../ui/button"
import { useColorScheme } from "app/hooks/color-scheme"
import { X } from "lucide-react-native"
import { GestureResponderEvent } from "react-native"
import { useRouter } from "solito/navigation"

export const CloseButton = (props: ButtonProps) => {
    const { colors } = useColorScheme()
    return (
        <Button variant={"base"} size={"none"} style={{ backgroundColor: colors.destructive }} className="p-1 rounded" {...props}>
            <X size={14} color={colors["destructive-foreground"]} />
        </Button>
    )
}

export const GoToFullListingButton = (props: ButtonProps & { listingId: string }) => {
    const router = useRouter()

    const goToDetailScreen = () => {
        router.push(`/listings/${props.listingId}`)
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToRoomButton = (props: ButtonProps & { roomId: string | Promise<string> }) => {
    const router = useRouter()

    const goToDetailScreen = async () => {
        const id = await props.roomId
        router.push(`/chat/${id}`)
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToProfileButton = (props: ButtonProps & { userId: string }) => {
    const router = useRouter()

    const goToProfileDetailed = () => {
        router.push(`/profile/${props.userId}`)
    }

    return <Button variant={"base"} size={"none"} onPress={goToProfileDetailed} {...props} />
}

export const GoToLocationListingsButton = (props: ButtonProps & { roomId: string }) => {
    const router = useRouter()

    const goToLocationDetailed = () => {
        router.push(`/locations/${props.roomId}`)
    }

    return <Button variant={"base"} size={"none"} onPress={goToLocationDetailed} {...props} />
}

export const GoToPostFeedbackButton = (props: ButtonProps & { userId: string }) => {
    const router = useRouter()

    const goToPostFeedback = () => {
        router.push(`/group/${props.userId}`)
    }

    return <Button variant={"base"} size={"none"} onPress={goToPostFeedback} {...props} />
}

export type GoToLoginButtonProps = ButtonProps & { additionalOnPress?: () => void }
export const GoToLoginButton = (props: GoToLoginButtonProps) => {
    const router = useRouter()

    const goToLogin = () => {
        router.push("/membership")
    }

    const handleOnPress = (e: GestureResponderEvent) => {
        props.additionalOnPress && props.additionalOnPress()
        goToLogin()
    }

    return <Button variant={"base"} size={"none"} onPress={handleOnPress} {...props} />
}

export const GoToActivityButton = (props: ButtonProps) => {
    const router = useRouter()

    const goToActivity = () => {
        router.push("/activity")
    }

    return <Button variant={"base"} size={"none"} onPress={goToActivity} {...props} />
}
