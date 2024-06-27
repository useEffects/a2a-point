import { Text } from "app/components/ui/text"
import { ArrowUpRight } from "app/components/icons"
import { Button } from "app/components/ui/button"
import useRouting from "app/hooks/use-routing"

export const GoToLoginButton = () => {
    const goToLogin = useRouting("login")
    return <Button onPress={goToLogin} variant={"default"} size={"default"} className="flex-row items-center">
        <Text>Take me to login screen</Text>
        <ArrowUpRight className="text-primary-foreground" />
    </Button>
}