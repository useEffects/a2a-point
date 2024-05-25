"use client"

import { useRouter } from 'next/navigation'
import { useContext } from "react"
import { Button } from "src/components/ui/button"
import { Text } from "src/components/ui/text"
import { AuthTokenContext } from "src/context/auth"
import { login } from "src/lib/login"

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