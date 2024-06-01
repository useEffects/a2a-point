"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SecondsBeforeRedirect = 5

export default function Protected({ uri = "/membership" }: { uri?: string }) {
    const router = useRouter()
    const [seconds, setSeconds] = useState(SecondsBeforeRedirect)

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev === 0) {
                    clearInterval(interval)
                    router.push(uri)
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [router, uri])

    return <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-destructive"> Protected page, login to unlock </p>
        <p>Redirecting in {seconds} seconds</p>
    </div>
}