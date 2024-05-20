import userStore from "app/store/user";
import Profile from "app/components/profile";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";

export default function ProfileScreen() {
    const { user } = userStore()
    return <ScrollView className="flex-1">
        {user && Object.keys(user).length ? <Profile user={user} /> : <></>}
    </ScrollView>
}