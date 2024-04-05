import { ReactNode, createContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import directusStore from "~/store/directus";

export const LargeScreenContext = createContext(false)

export const LargeScreenProvider = ({ children }: { children: ReactNode }) => {
    const [isLargeScreen, setIsLargeScreen] = useState(false)
    const { realtime } = directusStore()

    useEffect(() => {
        if (Platform.OS !== "web") {
            return
        }
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 640)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, [Platform])

    return <LargeScreenContext.Provider value={isLargeScreen}>
        {children}
    </LargeScreenContext.Provider>
}