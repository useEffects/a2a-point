"use client"

import { ReactNode } from "react"
import { ToggleTheme } from "./toggle-theme"
import { Footer } from "./footer"
import { Navbar } from "./navbar"

export const View = ({ children }: { children: ReactNode }) => {
    return <div className="w-full flex flex-col gap-12">
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
    </div>
}