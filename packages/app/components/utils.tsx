import { Button, ButtonProps } from "./ui/button"
import { useColorScheme } from "app/hooks/color-scheme"
import { X } from "lucide-react-native"
import { useRouter } from "solito/navigation"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "app/lib/misc/navigation"
import { Platform } from "react-native"

export const CloseButton = (props: ButtonProps) => {
    const { colors } = useColorScheme()
    return <Button variant={"base"} size={"none"} style={{ backgroundColor: colors.destructive }} className="p-1 rounded" {...props}>
        <X size={14} color={colors["destructive-foreground"]} />
    </Button>
}

export const GoToFullListingButton = (props: ButtonProps & { listingId: string }) => {
    const router = useRouter()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const goToDetailScreen = () => {
        if (Platform.OS !== "web") {
            navigation.getState() && navigation.navigate("listing-detailed", {
                id: props.listingId
            })
        } else {
            router.push(`/listing/${props.listingId}`)
        }
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToRoomButton = (props: ButtonProps & { roomId: string | Promise<string> }) => {
    const router = useRouter()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const goToDetailScreen = async () => {
        const id = await props.roomId
        if (Platform.OS !== "web") {
            navigation.getState() && navigation.navigate("room-detailed", {
                id
            })
        } else {
            router.push(`/chat/${props.roomId}`)
        }
    }

    return <Button variant={"base"} size={"none"} onPress={goToDetailScreen} {...props} />
}

export const GoToProfileButton = (props: ButtonProps & { userId: string }) => {

    const router = useRouter()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const goToProfileDetailed = () => {
        if (Platform.OS !== "web") {
            navigation.getState() && navigation.navigate("profile-detailed", {
                id: props.userId
            })
        } else {
            router.push(`/profile/${props.userId}`)
        }
    }

    return <Button variant={"base"} size={"none"} onPress={goToProfileDetailed} {...props} />
}

export const GoToLocationListingsButton = (props: ButtonProps & { roomId: string }) => {
    const router = useRouter()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const goToLocationDetailed = () => {
        if (Platform.OS !== "web") {
            navigation.getState() && navigation.navigate("location-listings", {
                id: props.roomId
            })
        } else {
            router.push(`/group/${props.roomId}`)
        }
    }

    return <Button variant={"base"} size={"none"} onPress={goToLocationDetailed} {...props} />
}

export const GoToPostFeedbackButton = (props: ButtonProps & { userId: string }) => {
    const router = useRouter()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const goToPostFeedback = () => {
        if (Platform.OS !== "web") {
            navigation.getState() && navigation.navigate("post-feedback", {
                id: props.userId
            })
        } else {
            router.push(`/group/${props.userId}`)
        }
    }

    return <Button variant={"base"} size={"none"} onPress={goToPostFeedback} {...props} />
}