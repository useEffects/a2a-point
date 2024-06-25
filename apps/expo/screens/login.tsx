import HeroGirl from "app/assets/hero-girl.png";
import { Header } from "app/components/header";
import Hero from "app/components/svg/hero";
import Logo from "app/components/svg/logo";
import { Button } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import useNavigation from "app/hooks/navigation";
import { directusUrl, portfolioUrl } from "app/lib/constants";
import directusStore from "app/store/directus";
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from "react";
import { Image, Linking, ScrollView, View } from "react-native";
import { parse } from "search-params";

const LoginScreen = () => {
    const { initialize, authenticated } = directusStore()
    const appURL = "a2apoint-community://"
    const navigation = useNavigation()

    useEffect(() => {
        const timer = setInterval(() => {
            if (authenticated) {
                navigation.navigate("home")
                clearInterval(timer)
            }
        }, 100)
        return () => clearInterval(timer)
    }, [authenticated, navigation])

    const handleLogin = async () => {
        const result = await WebBrowser.openAuthSessionAsync(`${directusUrl}/auth/login/keycloak?redirect=${portfolioUrl}/api/auth-redirect?appUrl=${appURL}`, appURL);
        if (result.type === "success") {
            const { access_token: accessToken, refresh_token: refreshToken } = parse(result.url)
            console.log({ accessToken, refreshToken })
            if (accessToken && refreshToken) {
                await initialize(accessToken.toString(), refreshToken.toString())
            }
        }
    }

    return <ScrollView contentContainerClassName="flex-grow">
        <Header>
            <Text className="text-xl font-semibold">Login</Text>
        </Header>
        <View className="flex-col justify-between flex-1 items-start px-4 py-8">
            <View className="flex-col items-center w-full">
                <Text className="text-2xl font-semibold">Welcome to <Text className="text-2xl text-primary">A2APoint</Text></Text>
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