"use client"

import { useIsSmallDevice } from "@/hooks/is-small-device";
import { HomeScreenComponent, HomeScreenListing } from "app/screens/home";

export default function Page() {
    const isSmallDevice = useIsSmallDevice()
    return isSmallDevice ? <div>
        <HomeScreenComponent />
    </div> : <div className="p-2">
        <HomeScreenListing className="max-w-none w-full md:max-w-xl md:w-auto" />
    </div>
}