/** @jsxImportSource react */

import { fetchAllData } from "@/lib/helpers"
import { ListingDetailedScreen } from "@/screens/listings"
import { readItem } from "@directus/sdk"
import { portfolioUrl } from "app/lib/constants"
import { buildAssetUrl } from "app/lib/helpers"
import { getFeedbacksCountForUser, getListingMetrics, getListingsCountForUser } from "app/lib/misc/queries"
import { fullListingCardFields, FullListingDetailedProps } from "app/lib/props"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import { Metadata } from "next"

export const revalidate = 60

const fetchListing = async (id: string) => {
    const { rest } = directusStore.getState() 

    return queryClient.fetchQuery({
    queryKey: ["Fetch listing for detailed screen", id],
    queryFn: async () => await rest.request(readItem("listings", id, {
        fields: fullListingCardFields
    })) as FullListingDetailedProps,
}).then(async res => {
    const metrics = await getListingMetrics(id)
    const listingsCount = await getListingsCountForUser(res.user_created.id)
    const ratingsCount = await getFeedbacksCountForUser(res.user_created.id)
    return { ...res, ...metrics, listingsCount, ratingsCount }
})}

export default async function ListingsDetailed ({ params }: { params: { id: string } }) {
    const { id } = params
    const listing = await fetchListing(id)

    return <ListingDetailedScreen listing={listing} />
}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("listings", {}, ["id"])
}

export async function generateMetaData({ params }: { params: { id: string } }) {
    const {id} = params
    const listing = await fetchListing(id)
    const listingImage =  listing.photo_1 || listing.photo_2 || listing.photo_3
    const image = listingImage ? buildAssetUrl(listingImage) : "https://a2apoint-misc.nyc3.digitaloceanspaces.com/app/logo.svg"

    return {
        title: listing.title,
        description: listing.description,
        metadataBase: new URL(`${portfolioUrl}/listings/${id}`),
        icons: image,
        openGraph: {
            title: listing.title,
            description: listing.description,
            type: "website",
            url: `${portfolioUrl}/listings/${id}`,
            locale: "en_US",
            images: {
                url: image,
            }
        },
        twitter: {
            title: listing.title,
            images: image
        }
    } as Metadata
}