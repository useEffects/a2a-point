import userStore from "app/store/user";
import { ProfileScreen as ProfileScreenComponent } from "app/screens/profile";
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
    const { authenticated, logout } = directusStore()
    return <View className="flex-1">
        <Header>
            <View className="flex-row gap-8 justify-between flex-1 items-center">
                <Text className="text-xl font-bold">Profile</Text>
                <View className="flex-row gap-4 items-center">
                    {authenticated ? <Button onPress={logout} variant="base" size="none">
                        <LogOut size={18} className="text-foreground" />
                    </Button> : <></>}
                    <ToggleTheme />
                </View>
            </View>
        </Header>
        <ProfileScreenComponent user={user} />
    </View>
}