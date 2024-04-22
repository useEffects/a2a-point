"use client"

import { Button } from "@/components/ui/button"
import { useContext, useEffect } from "react"
import { AuthTokenContext } from "@/context/authToken"
import { login } from "@/lib/login"
import { useRouter } from 'next/navigation'

export default function StartButton({ courseId, className }: { courseId: string, className?: string }) {
    const { token, setToken } = useContext(AuthTokenContext)
    const router = useRouter()

    const handleClick = async () => {
        if (!token) {
            const token = await login()
            setToken(token)
        }
        router.push(`/courses/${courseId}`)
    }

    return <div>
        <Button className={className} onClick={handleClick}> Start Now </Button>
    </div>
}