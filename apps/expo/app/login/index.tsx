import LoginScreenComponent from "app/screens/login"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function LoginScreen() {
    const insets = useSafeAreaInsets()
    return <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <LoginScreenComponent />
    </View>
}