"use client"

import ChatScreenComponent from "app/screens/chat"
import { Separator } from "app/components/ui/separator"
import ChatsProvider from "app/components/providers/chats"
import { ReactNode } from "react"
import { useIsSmallDevice } from "@/hooks/is-small-device"
import { cn } from "app/lib/utils"

export default function ChatLayout({ children }: { children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice()

    return <ChatsProvider>
        <div className="md:container flex h-screen mb-12">
            {!isSmallDevice && <>
                <div className="w-1/3 h-full">
                    <ChatScreenComponent />
                </div>
                <Separator orientation="vertical" />
            </>}
            <div className={cn(isSmallDevice ? "w-full": "w-2/3 bg-card h-full p-4")}>
                {children}
            </div>
        </div>
    </ChatsProvider>
}