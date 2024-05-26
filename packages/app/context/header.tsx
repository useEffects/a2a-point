import { ReactNode, createContext, useState } from "react";

export const HeaderContext = createContext<{ header: ReactNode, setHeader: (header: ReactNode) => void }>({ header: null, setHeader: () => { } })

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
    const [header, setHeader] = useState<ReactNode>(null)

    return <HeaderContext.Provider value={{ header, setHeader }}>
        {children}
    </HeaderContext.Provider>
}