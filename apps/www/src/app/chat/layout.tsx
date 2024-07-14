"use client"

import ChatScreenComponent, { ChatLocked } from "app/screens/chat"
import { Separator } from "app/components/ui/separator"
import { ReactNode } from "react"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { cn } from "app/lib/utils"
import directusStore from "app/store/directus"

export default function ChatLayout({ children }: { children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice()
    const { authenticated } = directusStore()

    return authenticated ? <div className="flex h-screen">
        {!isSmallDevice && <>
            <Separator orientation="vertical" />
            <div className="w-1/3 h-full">
                <ChatScreenComponent />
            </div>
            <Separator orientation="vertical" />
        </>}
        <div className={cn(isSmallDevice ? "w-full" : "w-2/3 bg-card h-full")}>
            {children}
        </div>
        <Separator orientation="vertical" />
    </div> : <div className="container px-0 flex">
        <Separator orientation="vertical" className="h-screen" />
        <div className="flex-grow w-full max-w-xl">
            <ChatLocked />
        </div>
        <Separator orientation="vertical" className="h-screen" />
    </div>
}