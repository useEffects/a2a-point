"use client"

import { useIsSmallDevice } from "app/hooks/is-small-device"
import { ReactNode } from "react"
import { cn } from "src/lib/utils"

export const HalfWidthDiv = ({ className, direction = "left", child1, child2 }: { className?: string, direction?: "left" | "right", child1: ReactNode, child2: ReactNode }) => {
    const isSmallDevice = useIsSmallDevice()
    return isSmallDevice ? <div className={cn("flex flex-col gap-4", className)}>
        <div className="w-full">
            {child1}
        </div>
        <div className="w-full">
            {child2}
        </div>
    </div> : <div className={cn("w-full grid", className)}>
        <div className="w-full h-full col-start-1 row-start-1">
            <div className={cn("w-1/2 h-full flex", direction === "left" ? "ml-auto mr-0" : "ml-0 mr-auto")}>
                {child2}
            </div>
        </div>
        <div className="container flex h-full col-start-1 row-start-1">
            <div className={cn("w-1/2 h-full flex", direction === "left" ? "ml-0 mr-auto" : "ml-auto mr-0")}>
                {child1}
            </div>
        </div>
    </div>
}