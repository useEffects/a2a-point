import directusStore from "app/store/directus"
import { useRouter } from "solito/navigation"
import * as WebBrowser from 'expo-web-browser';
import { directusUrl, portfolioUrl } from "app/lib/constants";
import { Image, Linking, ScrollView, View } from "react-native";
import { Text } from "app/components/ui/text";
import { Button } from "app/components/ui/button";
import Logo from "app/components/svg/logo";
import Hero from "app/components/svg/hero";
import HeroGirl from "app/assets/hero-girl.png"
import { Header } from "app/components/header";

const LoginScreen = () => {
    const { initialize } = directusStore()
    const router = useRouter()
    const appURL = "a2apoint-community://"

    const handleLogin = async () => {
        const result = await WebBrowser.openAuthSessionAsync(`${directusUrl}/auth/login/keycloak?redirect=${portfolioUrl}/api/expo-redirect?appUrl=${appURL}`, appURL);
        if (result.type === "success") {
            const accessToken = result.url.split("access_token=")[1]
            if (accessToken) {
                await initialize(accessToken)
                router.replace("/")
            }
        }
    }

    return <ScrollView contentContainerClassName="flex-grow">
        <Header>
            <Text className="text-xl font-bold">Login</Text>
        </Header>
        <View className="flex-col justify-between flex-1 items-start px-4 py-8">
            <View className="flex-col items-center w-full">
                <Text className="text-2xl font-bold">Welcome to <Text className="text-2xl text-primary">A2APoint</Text></Text>
                <Text>For more information visit</Text>
                <Button onPress={() => Linking.openURL("https://a2apoint.com")} size={"none"} variant={"base"}>
                    <Text className="text-info underline">https://a2apoint.com</Text>
                </Button>
            </View>
            <View className="flex-row justify-center w-full relative">
                <Hero width={350} height={350} />
                <Image alt="hero image" source={HeroGirl} style={{ width: 350, height: 350 }} className="absolute" resizeMode="contain" />
            </View>
            <Button onPress={handleLogin} className="w-full">
                <Text>Login or create account</Text>
            </Button>
            <View className="flex-col w-full items-center">
                <View className="p-4 bg-card rounded-full">
                    <Logo width={60} height={60} />
                </View>
                <Text className="text-sm text-subtext text-center">By continuing, you agree to our <Text className="text-sm text-info underline">Terms of Service</Text> and that you have read our <Text className="text-sm text-info underline">Privacy Policy</Text></Text>
            </View>
        </View>
    </ScrollView >
}

export default LoginScreen