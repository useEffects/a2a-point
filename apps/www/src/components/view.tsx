"use client"

import { ReactNode } from "react"
import { Footer } from "./footer"
import { Navbar } from "./navbar"
import { cn } from "app/lib/utils"
import { useIsSmallDevice } from "app/hooks/is-small-device"

export const View = ({ children }: { children: ReactNode }) => {
    const isSmallDevice = useIsSmallDevice()

    return <div className={cn("flex flex-col w-full", isSmallDevice && "w-full")}>
        <Navbar />
        <div className="w-full flex flex-row justify-center mb-12">
            {children}
        </div>
        <Footer />
    </div>
}