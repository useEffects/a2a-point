"use client"

import directusStore from "app/store/directus"
import { useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const TryLogin = () => {
    const { initialize } = directusStore()
    useEffect(() => {
        async function tryLogin() {
            const accessToken = await AsyncStorage.getItem("accessToken")
            const refreshToken = await AsyncStorage.getItem("refreshToken")
            if (accessToken && refreshToken) {
                initialize(accessToken, refreshToken)
            }
        }
        tryLogin()
    }, [])

    return <></>
}