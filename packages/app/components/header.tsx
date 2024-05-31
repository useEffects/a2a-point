import { useRouter } from "solito/navigation"
import { Button } from "./ui/button"
import { DimensionValue, Platform, View } from "react-native";
import { ReactNode } from "react";
import { MoveLeft } from "lucide-react-native"
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import useNavigation from "app/hooks/navigation";

export const headerHeight = 48

export const BackButton = () => {
    const { colors } = useColorScheme()
    const router = useRouter()
    const navigation = useNavigation()

    return navigation.canGoBack() ? <Button size={"icon"} className="rounded-full w-8 h-8" variant={"ghost"} onPress={router.back}>
        <MoveLeft size={18} color={colors.primary} />
    </Button> : <></>
}

export const Header = ({ children, height = headerHeight, className }: { children: ReactNode, height?: DimensionValue, className?: string }) => {
    return <View className={cn("flex-row items-center px-4 gap-2 bg-card", className)} style={{ height }}>
        {Platform.OS === "web" ? <></> : <BackButton />}
        {children}
    </View>
}