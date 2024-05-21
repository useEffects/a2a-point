import directusStore from "app/store/directus"
import { useRouter } from "solito/navigation"
import * as WebBrowser from 'expo-web-browser';
import { directusUrl, portfolioUrl } from "app/lib/constants";
import { Linking, ScrollView, View } from "react-native";
import { Text } from "app/components/ui/text";
import { Button } from "app/components/ui/button";
import { CompanyStats } from "app/components/company-stats";

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

    return <ScrollView className='py-4'>
        <View className='bg-accent w-full flex-col items-center gap-4 px-4 py-12'>
            <Text className='text-lg'>Welcome to <Text className='text-primary font-bold'>A2APoint</Text> </Text>
            <View>
                <Text>For more information, visit </Text>
                <Button onPress={() => Linking.openURL("https://a2apoint.com")} size={"none"} variant={"link"}>
                    <Text className='text-info text-sm underline'>https://a2apoint.com</Text>
                </Button>
            </View>
            <View className='flex-col gap-2'>
                <Button onPress={handleLogin}>
                    <Text>Sign in or Create an account (it&apos;s free) </Text>
                </Button>
                <Text className='text-sm text-center'>Sign in to unlock the full mobile application</Text>
            </View>
        </View>
        <Text className='text-center pb-8 font-semibold'>Sign in to view all the listings and much more!</Text>
        <CompanyStats className='justify-evenly' />
        <View className='my-4' />
    </ScrollView>
}

export default LoginScreen