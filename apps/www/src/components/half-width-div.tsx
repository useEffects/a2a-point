import { ReactNode } from "react"
import { cn } from "src/lib/utils"

export const HalfWidthDiv = ({ className, direction = "left", child1, child2 }: { className?: string, direction?: "left" | "right", child1: ReactNode, child2: ReactNode }) => {
    return <div className={cn("w-full grid items-center", className)}>
        <div className="container flex h-full col-start-1 row-start-1 items-center justify-center">
            <div className={cn("w-1/2 h-full flex items-center", direction === "left" ? "ml-0 mr-auto" : "ml-auto mr-0")}>
                {child1}
            </div>
        </div>
        <div className="w-full h-full col-start-1 row-start-1 items-center">
            <div className={cn("w-1/2 h-full flex items-center", direction === "left" ? "ml-auto mr-0" : "ml-0 mr-auto")}>
                {child2}
            </div>
        </div>
    </div>
}