"use client"

import ChatScreenComponent from "app/screens/chat"
import { Separator } from "app/components/ui/separator"
import ChatsProvider from "app/components/providers/chats"
import { ReactNode } from "react"

export default function ChatLayout({ children }: { children: ReactNode }) {
    return <ChatsProvider>
        <div className="container flex h-screen mb-12">
            <div className="w-1/3 h-full">
                <ChatScreenComponent />
            </div>
            <Separator orientation="vertical" />
            <div className="w-2/3 bg-card h-full p-4">
                {children}
            </div>
        </div>
    </ChatsProvider>
}