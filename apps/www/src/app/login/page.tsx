"use client"

import { useLogin } from "@/hooks/login"
import { useEffect } from "react"

export default function LoginPage() {
    const handleLogin = useLogin()

    useEffect(() => {
        handleLogin()
    }, [])

    return <></>
}