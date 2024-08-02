"use client"

import { useLogin } from '@/hooks/login'
import directusStore from 'app/store/directus'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "src/components/ui/button"
import { Text } from "src/components/ui/text"

export default function StartButton({ courseId, className }: { courseId: string, className?: string }) {
    const router = useRouter()
    const [clicked, setClicked] = useState(false)
    const { authenticated } = directusStore()
    const handleLogin = useLogin()

    const handleClick = async () => {
        if (!authenticated) {
            handleLogin()
            setClicked(true)
        } else {
            router.push(`/courses/${courseId}`)
        }
    }

    useEffect(() => {
        if (authenticated && clicked) {
            router.push(`/courses/${courseId}`)
        }
    }, [authenticated])

    return <div className={className}>
        <Button onPress={handleClick}>
            <Text>Start Now</Text>
        </Button>
    </div>
}