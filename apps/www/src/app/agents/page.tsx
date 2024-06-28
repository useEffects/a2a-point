"use client"

import { HeaderContext } from "@/components/app-layout"
import { UsersListComponent } from "app/screens/users-list"
import { useContext, useEffect } from "react"

export default function AgentsPage() {
    const { setTitle } = useContext(HeaderContext)

    useEffect(() => {
        setTitle("Agents")
        return () => setTitle("")
    }, [])

    return <div className="w-full">
        <UsersListComponent />
    </div>
}