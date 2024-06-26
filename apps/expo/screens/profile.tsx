import { Header } from "app/components/header";
import { Bell, EllipsisVertical, LogOut, UserCog2 } from "app/components/icons";
import { useGoToRoute } from "app/components/link-buttons";
import { ToggleTheme } from "app/components/toggle-theme";
import { Button } from "app/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "app/components/ui/dropdown-menu";
import { Text } from "app/components/ui/text";
import { ProfileScreen as ProfileScreenComponent } from "app/screens/profile";
import directusStore from "app/store/directus";
import userStore from "app/store/user";
import { useState } from "react";
import { View } from "react-native";

export default function ProfileScreen() {
    const { user } = userStore()
    const { authenticated, logout } = directusStore()
    return <View className="flex-1">
        <Header>
            <View className="flex-row gap-8 justify-between flex-1 items-center">
                <Text className="text-xl font-bold">Profile</Text>
                <View className="flex-row gap-4 items-center">
                    <ToggleTheme />
                    {authenticated ? <ProfileDropdown /> : <></>}
                </View>
            </View>
        </Header>
        <ProfileScreenComponent user={user} />
    </View>
}

const ProfileDropdown = () => {
    const goToNotifications = useGoToRoute("notifications")
    const goToAccountConsole = useGoToRoute("account-console")

    const [_, setOpen] = useState(false)

    return <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
                <EllipsisVertical size={24} className="text-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={-40}>
            <DropdownMenuItem>
                <View className="flex-row items-center gap-2">
                    <LogOut size={18} className="text-foreground" />
                    <Text>Logout</Text>
                </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => {
                setOpen(false)
                goToNotifications()
            }}>
                <View className="flex-row items-center gap-2">
                    <Bell size={18} className="text-foreground" />
                    <Text>Notifications</Text>
                </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => {
                setOpen(false)
                goToAccountConsole()
            }}>
                <View className="flex-row items-center gap-2">
                    <UserCog2 size={18} className="text-foreground" />
                    <Text>Account console</Text>
                </View>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}