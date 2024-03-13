"use client"

import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { useEffect } from "react";

export default function Page () {
    useEffect(() => {
        async function fetch() {
            const response = await directus.request(readItems("news_feeds"))
            console.log(response)
        }
    }, [directus])
    return <div></div>

}