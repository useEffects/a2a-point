"use client"

import { ReactNode } from "react"
import { usePathname } from 'next/navigation'
import Link from "next/link"
import { ToggleTheme } from "./toggle-theme"
import { Footer, navItems } from "./footer"

export const View = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    return <div className="w-full flex flex-col gap-12">
        <div className="flex justify-between h-32 my-4 container mx-auto relative z-50 p-4">
            <div className="flex flex-row gap-4 items-center h-full">
                <div className="h-full p-1 rounded bg-foreground shadow">
                    <img src="/logo.svg" alt="" className="h-full object-contain" />
                </div>
                <p className="font-extrabold text-xl"> A2A Point </p>
            </div>
            <div className="gap-4 hidden md:flex items-center">
                {navItems.map((item, index) => <Link style={{ color: pathname === item.href ? "hsl(var(--primary))" : undefined }} key={index} href={item.href}>
                    {item.label}
                </Link>)}
                <ToggleTheme />
            </div>
        </div>
        {children}
        <Footer />
    </div>
}