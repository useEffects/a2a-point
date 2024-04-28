import { useNavigation } from "expo-router"
import { Button } from "./ui/button"
import { Ionicons } from '@expo/vector-icons';

export const BackButton = () => {
    const navigation = useNavigation()
    return navigation.canGoBack() ? <Button size={"icon"} className="rounded-full mx-1 w-6 h-6" variant={"ghost"} onPress={navigation.goBack}>
        <Ionicons name="arrow-back" size={18} className="!text-primary" />
    </Button> : <></>
}