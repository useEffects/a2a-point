"use client"

import { useIsSmallDevice } from "app/hooks/is-small-device";
import { cn } from "app/lib/utils";
import ListingsScreenComponent from "app/screens/listings";

export default function Page() {
    const isSmallDevice = useIsSmallDevice()
    return <div className={cn(!isSmallDevice && "max-w-xl")}>
        <ListingsScreenComponent />
    </div>
}