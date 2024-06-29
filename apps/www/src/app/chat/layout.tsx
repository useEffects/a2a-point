"use client"

import ChatScreenComponent from "app/screens/chat"
import { Separator } from "app/components/ui/separator"
import { ReactNode } from "react"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { cn } from "app/lib/utils"

export default function ChatLayout({ children }: { children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice()

    return <div className="flex h-screen">
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
    </div>
}