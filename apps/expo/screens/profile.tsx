import { ProfileScreen as ProfileScreenComponent } from "app/screens/profile";
import userStore from "app/store/user";
import { View } from "react-native";

export default function ProfileScreen() {
    const { user, company, document } = userStore()
    return <View className="flex-1">
        <ProfileScreenComponent user={user} company={company} document={document} />
    </View>
}