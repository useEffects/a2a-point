"use client"

import { HeaderContext } from "@/components/app-layout"
import { Separator } from "app/components/ui/separator"
import { LocationsList } from "app/screens/locations-list"
import { useContext, useEffect } from "react"

export default function ListingsPage() {

    return <div>
        <LocationsList />
    </div>
}