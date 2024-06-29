/** @jsxImportSource react */

import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { bodies, CommonFilters, commonFilters, RenderListings } from "app/components/cards/molecules/listings";
import { MediumLocationCards } from "app/components/cards/molecules/locations";
import { Mode, RenderUsers } from "app/components/cards/molecules/users";
import { FilterKeys } from "app/screens/listings";
import { Separator } from "./ui/separator";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-1 flex-grow-[2]">
        <div className="container mx-auto flex flex-row flex-grow px-0">
            <Separator orientation="vertical" />
            {children}
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-12 max-w-lg mt-12 px-12">
                <div className="flex-col flex gap-8">
                    <p className="text-2xl font-bold"><span className="text-primary">Premium listings</span> curated by A2APoint</p>
                    <RenderListings<SmallListingCardProps>
                        render={bodies.small}
                        filter={commonFilters[CommonFilters.Premium]()}
                        paramFilter={[
                            { [FilterKeys.Premium]: CommonFilters.Premium }
                        ]}
                    />
                </div>
                <div className="flex-col flex gap-8">
                    <p className="text-2xl font-bold"><span className="text-primary">Top locations</span> to look for</p>
                    <MediumLocationCards
                    />
                </div>
                <div className="flex flex-col gap-8">
                    <p className="text-2xl font-bold">Top rated<span className="text-primary"> Agents</span></p>
                    <RenderUsers<MediumListingCardProps>
                        mode={Mode.medium}
                        limit={5}
                    />
                </div>
            </div>
        </div>
    </div>
}