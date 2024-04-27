import { router, useGlobalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useDeepLink from "~/hooks/deep-link";
import { directusUrl, portfolioUrl } from "~/lib/constants";
import { openUrl } from "~/lib/helpers";
import directusStore from "~/store/directus";

export default function LoginScreen() {
    const params = useGlobalSearchParams();
    const { linkedURL } = useDeepLink()
    const { initialize } = directusStore()

    const handleLogin = async () => {
        const result = await WebBrowser.openAuthSessionAsync(`${directusUrl}/auth/login/keycloak?redirect=${portfolioUrl}/api/expo-redirect?appUrl=${linkedURL}`, linkedURL);
        if (result.type === "success") {
            const accessToken = result.url.split("access_token=")[1]
            if (accessToken) {
                await initialize(accessToken)
                if (params?.redirect && typeof params.redirect === "string") {
                    // router.replace(params.redirect)
                } else {
                    router.replace("/")
                }
            }
        }
    }

    return linkedURL ? <View className="flex-row justify-center items-center h-full">
        <View className="max-w-md flex flex-col gap-4 justify-center items-center">
            <Text className="text-lg font-medium">Welcome to A2A Point Community App</Text>
            <Text className="text-muted-foreground">If you are a new user, visit <Text onPress={() => openUrl("https://a2apoint.com")}>here</Text></Text>
            <Button onPress={handleLogin} className="w-full">
                <Text>Login</Text>
            </Button>
        </View>
    </View> : <View />
}