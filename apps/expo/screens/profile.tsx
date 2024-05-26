import userStore from "app/store/user";
import Profile from "app/components/profile";
import directusStore from "app/store/directus";
import { View } from "react-native";
import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import LockedScreen from "app/screens/locked-screens";
import ProfileSVG from "app/components/svg/profile";
import { Button } from "app/components/ui/button";
import { ToggleTheme } from "app/components/toggle-theme";
import { LogOut } from "app/components/icons";

export default function ProfileScreen() {
    const { user } = userStore()
    const { authenticated } = directusStore()
    return <View className="flex-1">
        <Header>
            <View className="flex-row gap-8 justify-between flex-1 items-center">
                <Text className="text-xl font-bold">Profile</Text>
                <View className="flex-row gap-4 items-center">
                    {authenticated ? <Button variant="base" size="none">
                        <LogOut size={18} className="text-foreground" />
                    </Button> : <></>}
                    <ToggleTheme />
                </View>
            </View>
        </Header>
        {authenticated ? <Profile user={user} /> : <LockedScreen
            SVGComponent={<ProfileSVG width={300} height={300} />}
            readMoreLink="https://a2apoint.com"
            title="Showcase your profile on A2APoint, attract more clients and grow your business"
        />}
    </View>
}