/** @jsxImportSource react */

import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { RenderListings, smallListingBody } from "app/components/cards/molecules/listings";
import { MediumLocationCards } from "app/components/cards/molecules/locations";
import { RenderUsers } from "app/components/cards/molecules/users";
import { Separator } from "./ui/separator";
import { getFeedbacksCountForUser, getListingMetrics, getListingsCountForLocation, getListingsCountForUser, getMembersCountForLocation, renderCardsQuery } from "app/lib/misc/queries";
import { ListingCardMetrics, MediumLocationCardProps, mediumLocationFields, MediumUsersCardProps, mediumUsersFields, smallListingsFields } from "app/lib/props";
import { memberRole } from "app/lib/constants";

export async function AppLayout({ children }: { children: React.ReactNode }) {

    const premiumFilter = {
        featured: {
            _eq: true
        }
    }

    const listings = await renderCardsQuery<SmallListingCardProps>({
        collection: "listings",
        fields: smallListingsFields,
        filter: premiumFilter,
        limit: 3
    }).then(res =>
        Promise.all(res.map(async listing => {
            const metrics = await getListingMetrics(listing.id);
            return { ...listing, ...metrics };
        }))
    );

    const users = await renderCardsQuery<MediumUsersCardProps>({
        collection: "users",
        fields: mediumUsersFields,
        sort: ["score"],
        limit: 3,
        filter: {
            role: {
                _eq: memberRole
            }
        }
    }).then(res => Promise.all(res.map(async user => {
        const ratingsCount = await getFeedbacksCountForUser(user.id);
        const listingsCount = await getListingsCountForUser(user.id);
        return { ...user, ratingsCount, listingsCount };
    })))

    const locations = await renderCardsQuery<MediumLocationCardProps>({
        collection: "rooms",
        fields: mediumLocationFields,
        limit: 3,
        filter: {
            type: {
                _eq: "group"
            }
        }
    }).then(res => Promise.all(res.map(async location => {
        const membersCount = await getMembersCountForLocation(location.id);
        const listingsCount = await getListingsCountForLocation(location.id);
        return { ...location, membersCount, listingsCount };
    })))

    return <div className="flex flex-1 flex-grow-[2]">
        <div className="container mx-auto flex flex-row flex-grow px-0">
            <Separator orientation="vertical" />
            {children}
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-12 max-w-lg mt-12 px-12">
                <div className="flex-col flex gap-8">
                    <p className="text-2xl font-bold"><span className="text-primary">Premium listings</span> curated by A2APoint</p>
                    <RenderListings<SmallListingCardProps & ListingCardMetrics>
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