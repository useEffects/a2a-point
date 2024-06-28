/** @jsxImportSource react */

import { Menu } from "lucide-react"
import { Button } from "./ui/button"

export const Header = ({ title }: { title: string }) => {
    return <div className="w-full flex items-center justify-end p-4 bg-card">
        <p>{title}</p>
        <Button variant={"ghost"} size={"icon"}>
            <Menu className="text-foreground" />
        </Button>
    </div>
}