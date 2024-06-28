"use client"

import { HeaderContext } from "@/components/app-layout";
import { Separator } from "app/components/ui/separator";
import { useIsSmallDevice } from "app/hooks/is-small-device";
import { cn } from "app/lib/utils";
import ListingsScreenComponent from "app/screens/listings";
import { useContext, useEffect } from "react";

export default function Page() {

    const isSmallDevice = useIsSmallDevice()
    return <div className={cn(!isSmallDevice && "max-w-xl")}>
        <ListingsScreenComponent />
    </div>
}