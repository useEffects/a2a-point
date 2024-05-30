"use client"

import { useParams } from "next/navigation"
import ListingDetailed from "app/screens/listing-detailed"

export default function Page() {
    const { id } = useParams()
    return id ? <div className="max-w-xl">
        <ListingDetailed listingId={id as string} />
    </div> : <></>
}