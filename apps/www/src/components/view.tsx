"use client"

import { ReactNode } from "react"
import { Footer } from "./footer"
import { Navbar } from "./navbar"
import { cn } from "app/lib/utils"
import { useIsSmallDevice } from "@/hooks/is-small-device"
import { usePathname } from "next/navigation"
import { Separator } from "./ui/separator"

export const View = ({ children }: { children: ReactNode }) => {
    const isSmallDevice = useIsSmallDevice()
    const pathname = usePathname()

    return <div className={cn("flex flex-col", isSmallDevice ? "w-full" : "gap-12")}>
        <Navbar />
        {children}
        <Footer />
    </div>
}