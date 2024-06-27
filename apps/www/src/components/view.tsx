"use client"

import { ReactNode } from "react"
import { Footer } from "./footer"
import { Navbar } from "./navbar"
import { cn } from "app/lib/utils"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { usePathname } from "next/navigation"

export const View = ({ children }: { children: ReactNode }) => {
    const isSmallDevice = useIsSmallDevice()
    const pathname = usePathname()

    return <div className={cn("flex flex-col w-full", isSmallDevice ? "w-full" : "gap-12")}>
        <Navbar />
        <div className="w-full flex flex-row justify-center">
            {children}
        </div>
        <Footer />
    </div>
}