/** @jsxImportSource react */

import { fetchAllData } from "@/lib/helpers"
import { ListingDetailedScreen } from "@/screens/listings"

export const revalidate = 60

export default async function ({ params }: { params: { id: string } }) {
    const { id } = params
    return <div className="my-12">
        <ListingDetailedScreen listingId={id} />
    </div>

}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("listings", {}, ["id"])
}