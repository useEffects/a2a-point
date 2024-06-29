"use client"

import { Info } from "app/components/icons";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { useIsSmallDevice } from "app/hooks/is-small-device";
import { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice()

    return <div className="container min-h-screen flex">
        <div className="flex">
            <Separator orientation="vertical" className="h-full" />
        </div>
        <div className="flex-grow w-full">
            {children}
        </div>
        {!isSmallDevice && <div className="max-w-lg flex gap-8">
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 max-w-lg items-start justify-start p-4">
                    <div>
                        <Info className="w-12 h-12 text-info" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl font-bold text-info">A2APoint verification system enabled</p>
                        <p>
                            A2APoint has a verification system in place to ensure that all listings are authentic and genuine. We have a team of experts who verify the listings before they are published on our platform.
                        </p>
                    </div>
                </div>
                <Button>
                    <Text>Know more</Text>
                </Button>
            </div>
        </div>}
    </div>
}