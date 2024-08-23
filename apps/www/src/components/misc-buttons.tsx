"use client"

import { Button, ButtonProps } from "./ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGooglePlay, faAppStore, IconDefinition } from "@fortawesome/free-brands-svg-icons"
import { Text } from "./ui/text"
import { ReactNode } from "react"
import { appStoreLink, playStoreLink } from "@/lib/constants"

const storeButtons = (icon: IconDefinition, href: string) => {
    return (props: ButtonProps) => <a href={href} target="_blank">
        <Button className="w-full" {...props}>
            <Text className="flex flex-row gap-4 items-center">
                <FontAwesomeIcon icon={icon} className="!text-inherit" />
                {props.children as ReactNode}
            </Text>
        </Button>
    </a>
}

export const GooglePlayButton = storeButtons(faGooglePlay, playStoreLink)
export const AppStoreButton = storeButtons(faAppStore, appStoreLink)