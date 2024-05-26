import { Text } from "app/components/ui/text"
import { GoToLoginButton as Button } from "app/components/utils"
import { ArrowUpRight } from "app/components/icons"

export const GoToLoginButton = () => {
    <Button variant={"default"} size={"default"} className="flex-row items-center">
        <Text>Take me to login screen</Text>
        <ArrowUpRight className="text-primary-foreground" />
    </Button>
}