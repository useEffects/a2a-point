import { Pressable, PressableProps, GestureResponderEvent, Text } from "react-native"
import { useColorScheme } from "app/hooks/color-scheme"
import { X } from "lucide-react-native"
import { useRouter } from "solito/navigation"

export const CloseButton = (props: PressableProps) => {
    const { colors } = useColorScheme()
    return (
        <Pressable
            style={{ backgroundColor: colors.destructive, padding: 4, borderRadius: 4 }}
            {...props}
        >
            <X size={14} color={colors["destructive-foreground"]} />
            {props.children as React.ReactNode}
        </Pressable>
    )
}

export const GoToFullListingButton = (props: PressableProps & { listingId: string }) => {
    const router = useRouter()

    const goToDetailScreen = () => {
        router.push(`/listings/${props.listingId}`)
    }

    return (
        <Pressable onPress={goToDetailScreen} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToRoomButton = (props: PressableProps & { roomId: string | Promise<string> }) => {
    const router = useRouter()

    const goToDetailScreen = async () => {
        const id = await props.roomId
        router.push(`/chat/${id}`)
    }

    return (
        <Pressable onPress={goToDetailScreen} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToProfileButton = (props: PressableProps & { userId: string }) => {
    const router = useRouter()

    const goToProfileDetailed = () => {
        router.push(`/profile/${props.userId}`)
    }

    return (
        <Pressable onPress={goToProfileDetailed} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToLocationListingsButton = (props: PressableProps & { roomId: string }) => {
    const router = useRouter()

    const goToLocationDetailed = () => {
        router.push(`/locations/${props.roomId}`)
    }

    return (
        <Pressable onPress={goToLocationDetailed} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToPostFeedbackButton = (props: PressableProps & { userId: string }) => {
    const router = useRouter()

    const goToPostFeedback = () => {
        router.push(`/group/${props.userId}`)
    }

    return (
        <Pressable onPress={goToPostFeedback} {...props}>
            {props.children}
        </Pressable>
    )
}

export type GoToLoginButtonProps = PressableProps & { additionalOnPress?: () => void }
export const GoToLoginButton = (props: GoToLoginButtonProps) => {
    const router = useRouter()

    const goToLogin = () => {
        router.push("/membership")
    }

    const handleOnPress = (e: GestureResponderEvent) => {
        props.additionalOnPress && props.additionalOnPress()
        goToLogin()
    }

    return (
        <Pressable onPress={handleOnPress} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToActivityButton = (props: PressableProps) => {
    const router = useRouter()

    const goToActivity = () => {
        router.push("/activity")
    }

    return (
        <Pressable onPress={goToActivity} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToListingsListButton = (props: PressableProps) => {
    const router = useRouter()

    const goToListingsList = () => {
        console.log("here")
        router.push("/listings")
    }

    return (
        <Pressable onPress={goToListingsList} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToLocationsListButton = (props: PressableProps) => {
    const router = useRouter()

    const goToLocationsList = () => {
        router.push("/locations")
    }

    return (
        <Pressable onPress={goToLocationsList} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToMembersListButton = (props: PressableProps) => {
    const router = useRouter()

    const goToMembersList = () => {
        router.push("/members")
    }

    return (
        <Pressable onPress={goToMembersList} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToUsersListButton = (props: PressableProps) => {
    const router = useRouter()

    const goToGroupsList = () => {
        router.push("/groups")
    }

    return (
        <Pressable onPress={goToGroupsList} {...props}>
            {props.children}
        </Pressable>
    )
}

export const GoToPostButton = (props: PressableProps) => {
    const router = useRouter()

    const goToPost = () => {
        router.push("/post")
    }

    return (
        <Pressable onPress={goToPost} {...props}>
            {props.children}
        </Pressable>
    )
}