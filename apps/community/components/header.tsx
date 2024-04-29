import { useNavigation } from "expo-router"
import { Button } from "./ui/button"
import { Ionicons } from '@expo/vector-icons';
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReactNode } from "react";

export const headerHeight = 96

export const BackButton = () => {
    const navigation = useNavigation()
    return navigation.canGoBack() ? <Button size={"icon"} className="rounded-full w-6 h-6" variant={"ghost"} onPress={navigation.goBack}>
        <Ionicons name="arrow-back" size={18} className="!text-primary" />
    </Button> : <></>
}

export const Header = ({ children }: { children: ReactNode }) => {
    const { top: paddingTop } = useSafeAreaInsets()
    return <View className="flex-row items-center shadow bg-card px-2 gap-2" style={{ paddingTop, height: headerHeight }}>
        <BackButton />
        {children}
    </View>
}