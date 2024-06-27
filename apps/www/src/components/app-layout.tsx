"use client"

import { Separator } from "./ui/separator";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { MediumLocationCards } from "app/components/cards/molecules/locations";
import { Mode, RenderUsers } from "app/components/cards/molecules/users";
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { FilterKeys } from "app/screens/listings";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto flex flex-row gap-12">
        <div className="flex-grow">
            <div className="max-w-xl">
                {children}
            </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-12 min-w-md max-w-md">
            <div className="flex-col flex gap-8">
                <p className="text-3xl font-bold"><span className="text-primary">Premium listings</span> curated by A2APoint</p>
                <RenderListings<SmallListingCardProps>
                    render={bodies.small}
                    filter={commonFilters[CommonFilters.Premium]()}
                    paramFilter={[
                        { [FilterKeys.Premium]: CommonFilters.Premium }
                    ]}
                />
            </div>
            <div className="flex-col flex gap-8">
                <p className="text-3xl font-bold"><span className="text-primary">Top locations</span> to look for</p>
                <MediumLocationCards
                />
            </div>
            <div className="flex flex-col gap-8">
                <p className="text-3xl font-bold">Top rated<span className="text-primary"> Agents</span></p>
                <RenderUsers<MediumListingCardProps>
                    mode={Mode.medium}
                    limit={5}
                />
            </div>
        </div>
    </div>
}