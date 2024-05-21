import { Button, ButtonProps } from "./ui/button"
import { useColorScheme } from "app/hooks/color-scheme"
import { X } from "lucide-react-native"

export const CloseButton = (props: ButtonProps) => {
    const { colors } = useColorScheme()
    return <Button variant={"base"} size={"none"} style={{ backgroundColor: colors.destructive }} className="p-1 rounded" {...props}>
        <X size={14} color={colors["destructive-foreground"]} />
    </Button>
}