"use client"

import { NewsLetter } from "@/components/news-letter";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function NewsLetterPage() {

    const handleUnSubscribe = () => {

    }

    return <div className="container p-4 mx-auto flex flex-col gap-12">
        <NewsLetter />
        <Separator />
        <p className="text-3xl font-bold">Already a subscriber?</p>
        <div className="flex flex-col md:flex-row gap-8">
            <p className="md:w-1/2">
                If you no longer wish to receive our emails, please enter your email address below and click the "Unsubscribe" button
            </p>
            <div className="flex gap-4 md:w-1/2">
                <Input className="w-[calc(100%-120px)]" placeholder="Email" />
                <Button className="w-[120px]" onPress={handleUnSubscribe}>
                    <Text>Unsubscribe</Text>
                </Button>
            </div>
        </div>
    </div>
}