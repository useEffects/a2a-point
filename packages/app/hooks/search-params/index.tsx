import { useSearchParams as useSearchParamsSN } from "solito/navigation"

export const useSearchParams = () => {
    /** undefined for native */
    return undefined as ReturnType<typeof useSearchParamsSN>
}