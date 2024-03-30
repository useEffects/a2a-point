import { useContext } from "react"
import { directusUrl } from "./constants"
import { AuthContext } from "~/context/auth"

export const buildAssetUrl = (id: string) => {
    const authData = useContext(AuthContext)
    return `${directusUrl}/assets/${id}?access_token=${authData?.access_token}`
}