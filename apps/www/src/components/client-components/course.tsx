"use client"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useContext } from "react"
import { AuthTokenContext } from "@/context/auth"
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

    return <div className={className}>
        <Button onPress={handleClick}>
            <Text>Start Now</Text>
        </Button>
    </div>
}