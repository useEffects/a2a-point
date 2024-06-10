import { useColorScheme } from "app/hooks/color-scheme"
import useNavigation from "app/hooks/navigation"
import { X } from "lucide-react-native"
import { GestureResponderEvent } from "react-native"
import { Button, ButtonProps } from "../ui/button"
import { FilterKeys, FilterType } from "app/screens/listings"

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
        navigation.getState() && navigation.push("listing-detailed", {
            id: props.listingId
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToRoomButton = (props: ButtonProps & { roomId: string | Promise<string> }) => {
    const navigation = useNavigation()

    const goToDetailScreen = async () => {
        const id = await props.roomId
        navigation.getState() && navigation.push("room-detailed", {
            id
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToProfileButton = (props: ButtonProps & { userId: string, additionalOnPress?: () => void }) => {
    const navigation = useNavigation()

    const goToProfileDetailed = () => {
        props.additionalOnPress && props.additionalOnPress()
        navigation.getState() && navigation.push("profile-detailed", {
            id: props.userId
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToProfileDetailed} {...props} />
}

export const GoToLocationListingsButton = (props: ButtonProps & { roomId: string }) => {
    const navigation = useNavigation()

    const goToLocationDetailed = () => {
        navigation.getState() && navigation.push("location-listings", {
            id: props.roomId
        })
    }

    return <Button variant={"base"} size={"none"} onPress={goToLocationDetailed} {...props} />
}

export const GoToPostFeedbackButton = (props: ButtonProps & { agentId: string, feedbackId?: string }) => {
    const navigation = useNavigation()

    const goToPostFeedback = () => {
        navigation.getState() && navigation.push("post-feedback", {
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

export const GoToActivityButton = (props: ButtonProps) => {
    const navigation = useNavigation()

    const goToActivity = () => {
        navigation.getState() && navigation.push("activity")
    }

    return <Button variant={"base"} size={"none"} onPress={goToActivity} {...props} />
}

export const GoToNotificationsButton = (props: ButtonProps) => {
    const navigation = useNavigation()

    const goToNotifications = () => {
        navigation.getState() && navigation.push("notifications")
    }

    return <Button variant={"base"} size={"none"} onPress={goToNotifications} {...props} />
}

export const GoToPostButton = (props: ButtonProps) => {
    const navigation = useNavigation()

    const goToPost = () => {
        navigation.getState() && navigation.push("post")
    }

    return <Button variant={"base"} size={"none"} onPress={goToPost} {...props} />
}

export const GoToLocationsListButton = (props: ButtonProps) => {
    const navigation = useNavigation()

    const goToLocationsList = () => {
        navigation.getState() && navigation.push("locations-list")
    }

    return <Button variant={"base"} size={"none"} onPress={goToLocationsList} {...props} />
}

export const GoToUsersListButton = (props: ButtonProps) => {
    const navigation = useNavigation()

    const goToUsersList = () => {
        navigation.getState() && navigation.push("users-list")
    }

    return <Button variant={"base"} size={"none"} onPress={goToUsersList} {...props} />
}

export const GoToCompanyListButton = (props: ButtonProps) => {
    const navigation = useNavigation()

    const goToCompanyList = () => {
        navigation.getState() && navigation.push("company-list")
    }

    return <Button variant={"base"} size={"none"} onPress={goToCompanyList} {...props} />
}

export const GoToListingsListButton = (props: ButtonProps & {
    filter?: {
        key: FilterKeys,
        id: string
    }
}) => {
    const navigation = useNavigation()

    const goToListingsList = () => {
        navigation.getState() && navigation.navigate("listings", props.filter)
    }

    return <Button variant={"base"} size={"none"} onPress={goToListingsList} {...props} />
}