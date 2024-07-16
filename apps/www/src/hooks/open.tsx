"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

export const OpenContext = createContext<{
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}>({
    isOpen: false,
    setIsOpen: () => { }
})

export const OpenProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)

    return <OpenContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
    </OpenContext.Provider>
}