import { useRouter } from "solito/navigation"
import { useNavigation } from '@react-navigation/native';
import { Button } from "./ui/button"
import { View } from "react-native";
import { ReactNode } from "react";
import { MoveLeft } from "lucide-react-native"
import { useColorScheme } from "app/hooks/color-scheme";

export const headerHeight = 48

export const BackButton = () => {
    const { colors } = useColorScheme()
    const router = useRouter()
    const navigation = useNavigation()

    return navigation.canGoBack() ? <Button size={"icon"} className="rounded-full w-8 h-8" variant={"ghost"} onPress={router.back}>
        <MoveLeft size={18} color={colors.primary} />
    </Button> : <></>
}

export const Header = ({ children }: { children: ReactNode }) => {
    return <View className="flex-row items-center px-4 gap-2 bg-card" style={{ height: headerHeight }}>
        <BackButton />
        {children}
    </View>
}