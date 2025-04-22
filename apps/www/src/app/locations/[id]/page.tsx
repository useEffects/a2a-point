/** @jsxImportSource react */

import { fetchAllData } from "@/lib/helpers"
import { LocationDetailedScreen } from "@/screens/location"
import { readItem } from "@directus/sdk"
import { MediumListingCardProps } from "app/components/cards/atoms/medium"
import { portfolioUrl } from "app/lib/constants"
import { buildAssetUrl } from "app/lib/helpers"
import { getListingMetrics, getMembersCountForLocation, renderCardsQuery } from "app/lib/misc/queries"
import { mediumListingsFields } from "app/lib/props"
import { LocationListingProps } from "app/screens/location-detailed"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import { Metadata } from "next"

export const revalidate = 60

const fetchLocation = async (id: string) => {
    const { rest } = directusStore.getState()

    return queryClient.fetchQuery<LocationListingProps>({
        queryKey: ["Fetch locations data", id],
        queryFn: async () => await rest.request(readItem("rooms", id, {
            fields: ["id", "title", "avatar", "members.directus_users_id.id", "members.directus_users_id.avatar"]
        })) as Promise<LocationListingProps>
    })
}

export default async function listingsDetailed ({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await fetchLocation(id)

    const totalMembersForLocation = await getMembersCountForLocation(id)

    const listings = await renderCardsQuery<MediumListingCardProps>({
        collection: "listings",
        fields: mediumListingsFields,
        filter: {
            location: {
                _eq: id
            }
        }
    }).then(res => Promise.all(res.map(async listing => {
        const metrics = await getListingMetrics(listing.id)
        return { ...listing, ...metrics }
    })))

    return data ? <div className="w-full">
        <LocationDetailedScreen room={data} totalMembers={totalMembersForLocation} listings={listings} />
    </div> : <></>
}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("rooms", {
        type: {
            _eq: "group"
        }
    }, ["id"])
}

export async function generateMetaData({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
    const location = await fetchLocation(id)
    const locationImage = location.avatar
    const image = locationImage ? buildAssetUrl(locationImage) : "https://a2apoint-misc.nyc3.digitaloceanspaces.com/app/logo.svg"

    return {
        title: location.title,
        description: '',
        metadataBase: new URL(`${portfolioUrl}/locations/${id}`),
        icons: image,
        openGraph: {
            title: location.title,
            description: '',
            type: "website",
            url: `${portfolioUrl}/agents/${id}`,
            locale: "en_US",
            images: {
                url: image,
            }
        },
        twitter: {
            title: location.title,
            images: image
        }
    } as Metadata
}