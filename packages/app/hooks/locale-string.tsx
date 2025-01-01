import { useEffect, useState } from "react"

export const useLocaleString = (val?: number) => {
    const [localeString, setLocaleString] = useState<string>(val?.toString() ?? "")
    useEffect(() => {
        setLocaleString(String(val?.toLocaleString()) ?? "")
    }, [val])
    return localeString
}

export const useLocalizedCost = (dealType: string, budget: number, price: number) => {
    return useLocaleString((dealType === "buy" || dealType === "take on rent") ? budget : price)
}