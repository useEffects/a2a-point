import { Button, ButtonProps } from "app/components/ui/button"
import { useColorScheme } from "app/hooks/color-scheme"
import { X } from "lucide-react-native"
import { FilterKeys } from "app/screens/listings"
import { useParams, useRouter, useSearchParams } from "solito/navigation"
import { GestureResponderEvent } from "react-native"

export const CloseButton = (props: ButtonProps) => {
    const { colors } = useColorScheme()
    return (
        <Button
            variant="base"
            size="none"
            style={{ backgroundColor: colors.destructive, padding: 4, borderRadius: 4 }}
            {...props}
        >
            <X size={14} color={colors["destructive-foreground"]} />
            {props.children as React.ReactNode}
        </Button>
    )
}

export const GoToFullListingButton = (props: ButtonProps & { listingId: string }) => {
    const router = useRouter()

    const goToDetailScreen = () => {
        router.push(`/listings/${props.listingId}`)
    }

    return (
        <Button variant="base" size="none" onPress={goToDetailScreen} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToRoomButton = (props: ButtonProps & { roomId: string | Promise<string> }) => {
    const router = useRouter()

    const goToDetailScreen = async () => {
        const id = await props.roomId
        router.push(`/chat/${id}`)
    }

    return (
        <Button variant="base" size="none" onPress={goToDetailScreen} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToProfileButton = (props: ButtonProps & { userId: string }) => {
    const router = useRouter()

    const goToProfileDetailed = () => {
        router.push(`/profile/${props.userId}`)
    }

    return (
        <Button variant="base" size="none" onPress={goToProfileDetailed} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToLocationListingsButton = (props: ButtonProps & { roomId: string }) => {
    const router = useRouter()

    const goToLocationDetailed = () => {
        router.push(`/locations/${props.roomId}`)
    }

    return (
        <Button variant="base" size="none" onPress={goToLocationDetailed} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToPostFeedbackButton = (props: ButtonProps & { userId: string }) => {
    const router = useRouter()

    const goToPostFeedback = () => {
        router.push(`/group/${props.userId}`)
    }

    return (
        <Button variant="base" size="none" onPress={goToPostFeedback} {...props}>
            {props.children}
        </Button>
    )
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

    return (
        <Button variant="base" size="none" onPress={handleOnPress} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToActivityButton = (props: ButtonProps) => {
    const router = useRouter()

    const goToActivity = () => {
        router.push("/activity")
    }

    return (
        <Button variant="base" size="none" onPress={goToActivity} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToListingsListButton = (props: ButtonProps & {
    filter?: {
        key: FilterKeys,
        id: string
    }
}) => {
    const router = useRouter()
    const params = useSearchParams()

    const goToListingsList = () => {
        console.log(props.filter)
        if (params && props.filter?.key && props.filter?.id) {
            params?.set("key", props.filter.key)
            params?.set("id", props.filter.id)
            router.push(`/listings?${params.toString()}`)
        }
    }

    return (
        <Button variant="base" size="none" onPress={goToListingsList} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToLocationsListButton = (props: ButtonProps) => {
    const router = useRouter()

    const goToLocationsList = () => {
        router.push("/locations")
    }

    return (
        <Button variant="base" size="none" onPress={goToLocationsList} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToMembersListButton = (props: ButtonProps & {
    locationId: string
}) => {
    const router = useRouter()

    const goToMembersList = () => {
        router.push(`/locations/${props.locationId}/members`)
    }

    return (
        <Button variant="base" size="none" onPress={goToMembersList} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToUsersListButton = (props: ButtonProps) => {
    const router = useRouter()

    const goToGroupsList = () => {
        router.push("/agents")
    }

    return (
        <Button variant="base" size="none" onPress={goToGroupsList} {...props}>
            {props.children}
        </Button>
    )
}

export const GoToPostButton = (props: ButtonProps) => {
    const router = useRouter()

    const goToPost = () => {
        router.push("/post")
    }

    return (
        <Button variant="base" size="none" onPress={goToPost} {...props}>
            {props.children}
        </Button>
    )
}