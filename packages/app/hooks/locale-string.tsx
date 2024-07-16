import { useEffect, useState } from "react"

export const useLocaleString = (val?: number) => {
    const [localeString, setLocaleString] = useState<string>(val?.toString() ?? "")
    useEffect(() => {
        setLocaleString(String(val?.toLocaleString()) ?? "")
    }, [])
    return localeString
}