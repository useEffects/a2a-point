import { Header } from "app/components/header"
import ChatSVG from "app/components/svg/chat"
import { Text } from "app/components/ui/text"
import ChatScreenComponent from "app/screens/chat"
import LockedScreen from "app/screens/locked-screens"
import directusStore from "app/store/directus"
import { View } from "react-native"

export default function ChatScreen() {
    const { authenticated } = directusStore()
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-semibold">Chat</Text>
        </Header>
        {authenticated ? <ChatScreenComponent /> : <LockedScreen
            SVGComponent={<ChatSVG width={300} height={300} />}
            readMoreLink="https://a2apoint.com"
            title="Chat with other users on A2APoint!"
        />}
    </View>
}