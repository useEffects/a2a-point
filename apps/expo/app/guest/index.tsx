import { createStackNavigator } from '@react-navigation/stack';
import { Text } from "app/components/ui/text";
import { Linking, ScrollView, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { RenderListings, bodies } from "app/components/listings-cards/molecules/listings";
import { Button } from 'app/components/ui/button';
import { MediumListingCardProps } from 'app/components/listings-cards/atoms/medium';
import { Separator } from 'app/components/ui/separator';
import GuestFullListingScreen from './listings';
import { CompanyStats } from 'app/components/company-stats';
import * as WebBrowser from "expo-web-browser";
import { directusUrl, portfolioUrl } from 'app/lib/constants';
import directusStore from 'app/store/directus';
import { useRouter } from "solito/navigation"

const Stack = createStackNavigator();

const GuestScreen = () => {
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
            <View className='p-4 bg-white rounded-full'>
                <SvgUri uri="https://a2apoint.com/logo.svg" width={50} height={50} />
            </View>
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
        <RenderListings<MediumListingCardProps>
            render={bodies.medium}
            limit={2}
            noAds={true}
            flatListProps={{
                scrollEnabled: false,
                contentContainerClassName: "px-4",
                ItemSeparatorComponent: () => <Separator />
            }}
        />
        <Text className='text-center pb-8 font-semibold'>Sign in to view all the listings and much more!</Text>
        <CompanyStats className='justify-evenly' />
        <View className='my-4' />
    </ScrollView>
}

export default function GuestLayout() {
    return <Stack.Navigator initialRouteName='guest' screenOptions={{ header: () => null }}>
        <Stack.Screen name="guest/listings" component={GuestFullListingScreen} />
        <Stack.Screen options={{ presentation: "modal" }} name="guest" component={GuestScreen} />
    </Stack.Navigator>
}