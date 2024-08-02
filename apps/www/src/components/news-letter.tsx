"use client"

import { useLogin } from "@/hooks/login"
import directusStore from "app/store/directus"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Text } from "src/components/ui/text"
import * as yup from "yup"

export const NewsLetter = () => {
    const handleLogin = useLogin()
    const { authenticated } = directusStore()
    const [input, setInput] = useState("")

    const handleSubscribe = async () => {
        if (!authenticated) {
            handleLogin()
        } else {
            if (yup.string().email().isValidSync(input)) {
                const res = await fetch("/api/newsletter", {
                    method: "POST",
                    body: JSON.stringify({
                        email: input
                    })
                })
                console.log(res)
            }
        }
    }


    return <div className="container flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 p-0" id="news-letter">
        <div className="flex flex-col gap-8 w-full md:w-1/2">
            <p className="text-3xl md:text-5xl font-bold"> Stay in the <span className="text-primary"> loop </span> </p>
            <p className="">Stay informed and up-to-date with the latest developments. Our platform ensures you never miss important updates, news, and opportunities. Join us to stay connected and engaged with our vibrant community.</p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
            <div className="flex gap-4 w-full">
                <Input className="w-[calc(100%-120px)]" placeholder="Email" />
                <Button className="w-[120px]" onPress={handleSubscribe}>
                    <Text>Subscribe</Text>
                </Button>
            </div>
        </div>
    </div>
}