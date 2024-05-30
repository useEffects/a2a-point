import { Button, ButtonProps } from "./ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGooglePlay, faAppStore, IconDefinition } from "@fortawesome/free-brands-svg-icons"
import { Text } from "./ui/text"
import { ReactNode } from "react"
import { cn } from "app/lib/utils"

const storeButtons = (icon: IconDefinition, href: string) => {
    return (props: ButtonProps) => <Button {...props} href={href}>
        <Text className="flex flex-row gap-4 items-center">
            <FontAwesomeIcon icon={icon} className="!text-inherit" />
            {props.children as ReactNode}
        </Text>
    </Button>
}

export const GooglePlayButton = storeButtons(faGooglePlay, "")
export const AppStoreButton = storeButtons(faAppStore, "")