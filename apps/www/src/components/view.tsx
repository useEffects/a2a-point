"use client"

import { ReactNode, useMemo } from "react"
import { Footer } from "./footer"
import { MobileNavbar, Navbar, navItems } from "./navbar"
import { usePathname } from "next/navigation"

export const View = ({ children }: { children: ReactNode }) => {
    const pathName = usePathname()
    const segments = pathName.split("/")
    const isProductPathname = useMemo(() => navItems.find(item => item.title === "Product")?.items.some(subItem => segments.length > 1 && subItem.href === `/${segments[1]}`), [pathName])

    return <div>
        {isProductPathname ? <div className="flex flex-col w-full relative">
            <div className="min-h-screen flex flex-col md:flex-row w-full md:relative">
                <Navbar />
                <div className="container px-0 -mt-16 md:mt-auto pb-16 md:pb-0">
                    {children}
                </div>
                <div className="flex-grow"></div>
            </div>
            <Footer />
        </div> : <div className="flex flex-col gap-12 w-full">
            <Navbar />
            {children}
            <Footer />
        </div>}
        <MobileNavbar />
    </div>
}