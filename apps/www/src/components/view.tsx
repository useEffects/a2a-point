"use client"

import { ReactNode, useMemo } from "react"
import { Footer } from "./footer"
import { Navbar, navItems } from "./navbar"
import { cn } from "app/lib/utils"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { usePathname } from "next/navigation"

export const View = ({ children }: { children: ReactNode }) => {
    const isSmallDevice = useIsSmallDevice()
    const pathName = usePathname()
    const segments = pathName.split("/")
    const isProductPathname = useMemo(() => navItems.find(item => item.title === "Product")?.items.some(subItem => segments.length > 1 && subItem.href === `/${segments[1]}`), [pathName])

    return isProductPathname ? <div className="flex flex-col w-full">
        <div className="flex w-full relative">
            <Navbar />
            <div className="container px-0">
                {children}
            </div>
            <div className="flex-grow"></div>
        </div>
        <Footer />
    </div> : <div className="flex flex-col gap-12 w-full">
        <Navbar />
        {children}
        <Footer />
    </div>
}