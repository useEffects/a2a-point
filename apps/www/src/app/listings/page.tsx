"use client"

import HomeScreen from "app/screens/home"

export default function Page() {
    return <div className="container flex gap-4">
        <div className="w-2/3">
            <HomeScreen />
        </div>
    </div>
}