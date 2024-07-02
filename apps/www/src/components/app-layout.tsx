/** @jsxImportSource react */

import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { RenderListings, smallListingBody } from "app/components/cards/molecules/listings";
import { MediumLocationCards } from "app/components/cards/molecules/locations";
import { RenderUsers } from "app/components/cards/molecules/users";
import { Separator } from "./ui/separator";
import { renderCardsQuery } from "app/lib/misc/queries";
import { MediumLocationCardProps, mediumLocationFields, MediumUsersCardProps, mediumUsersFields, smallListingsFields } from "app/lib/props";

export async function AppLayout({ children }: { children: React.ReactNode }) {

    const premiumFilter = {
        featured: {
            _eq: true
        }
    }

    const listings = await renderCardsQuery<SmallListingCardProps>({
        collection: "listings",
        fields: smallListingsFields,
        filter: premiumFilter
    })
    const users = await renderCardsQuery<MediumUsersCardProps>({
        collection: "users",
        fields: mediumUsersFields,
        sort: ["score"]
    })
    const locations = await renderCardsQuery<MediumLocationCardProps>({
        collection: "rooms",
        fields: mediumLocationFields,
    })

    return <div className="flex flex-1 flex-grow-[2]">
        <div className="container mx-auto flex flex-row flex-grow px-0">
            <Separator orientation="vertical" />
            {children}
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-12 max-w-lg mt-12 px-12">
                <div className="flex-col flex gap-8">
                    <p className="text-2xl font-bold"><span className="text-primary">Premium listings</span> curated by A2APoint</p>
                    <RenderListings<SmallListingCardProps>
                        render={smallListingBody}
                        filter={premiumFilter}
                        paramFilters={[
                            { "premium": "premium" }
                        ]}
                        initialData={listings}
                    />
                </div>
                <div className="flex-col flex gap-8">
                    <p className="text-2xl font-bold"><span className="text-primary">Top locations</span> to look for</p>
                    <MediumLocationCards
                        initialData={locations}
                    />
                </div>
                <div className="flex flex-col gap-8">
                    <p className="text-2xl font-bold">Top rated<span className="text-primary"> Agents</span></p>
                    <RenderUsers<MediumUsersCardProps>
                        mode={"medium"}
                        initialData={users}
                    />
                </div>
            </div>
        </div>
    </div>
}