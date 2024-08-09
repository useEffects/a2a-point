import { Text } from "app/components/ui/text"
import { ArrowUpRight } from "app/components/icons"
import { Button } from "app/components/ui/button"
import { useRouter } from "solito/navigation"

export const GoToLoginButton = () => {
    const router = useRouter()

    return <Button onPress={() => router.push("/login")} variant={"default"} size={"default"} className="flex-row items-center">
        <Text>Take me to login screen</Text>
        <ArrowUpRight className="text-primary-foreground" />
    </Button>
}