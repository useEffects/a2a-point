"use client"

import { useIsSmallDevice } from "@/hooks/is-small-device";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { Info } from "lucide-react";
import { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice()

    return <div className="container p-4 mx-auto flex gap-12 min-h-screen">
        <div className="w-full md:w-[60%]">
            <div className="max-w-xl">
                {children}
            </div>
        </div>
        {!isSmallDevice && <>
            <Separator className="self-stretch h-auto" orientation="vertical" />
            <div className="flex-1 h-full flex flex-col gap-8">
                <div className="flex gap-4 items-start justify-start">
                    <span>
                        <Info className="text-info self-start" size={32} />
                    </span>
                    <div className="flex flex-col gap-4">
                        <p className="text-xl font-bold text-info">Verification system by A2APoint</p>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error aspernatur repellendus animi in doloribus debitis! Qui possimus doloremque repellat vel!</p>
                    </div>
                </div>
                <Button className="w-full">
                    <Text>Know more</Text>
                </Button>
            </div>
        </>}
    </div>
}