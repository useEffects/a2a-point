"use client"

import { createContext, useState } from "react";

export const NavbarContext = createContext({
    open: false as boolean,
    setOpen: (open: boolean) => { }
});

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)

    return <NavbarContext.Provider value={{ open, setOpen }}>
        {children}
    </NavbarContext.Provider>
}
