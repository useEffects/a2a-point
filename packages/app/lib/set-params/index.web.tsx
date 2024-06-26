import { usePathname, useRouter } from "solito/navigation"


export const useSetParams = (key: string, value: any) => {
    const router = useRouter()
    const pathname = usePathname()

    const setParams = () => {
        const searchParams = new URLSearchParams(pathname)
        searchParams.append(key, value)
        router.push(`${pathname}?${searchParams.toString()}`)
    }

    return setParams
}