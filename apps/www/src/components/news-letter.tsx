/** @jsxImportSource react */

import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Text } from "src/components/ui/text"

export const NewsLetter = () => {
    return <div className="container flex flex-col md:flex-row justify-center items-center gap-4 p-4">
        <div className="flex flex-col gap-8 w-full md:w-1/2">
            <p className="text-3xl md:text-5xl font-bold"> Stay in the <span className="text-primary"> loop </span> </p>
            <p>Stay informed and up-to-date with the latest developments. Our platform ensures you never miss important updates, news, and opportunities. Join us to stay connected and engaged with our vibrant community.</p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
            <div className="flex gap-4 w-full">
                <Input className="w-[calc(100%-120px)]" placeholder="Email" />
                <Button className="w-[120px]">
                    <Text>Subscribe</Text>
                </Button>
            </div>
        </div>
    </div>
}