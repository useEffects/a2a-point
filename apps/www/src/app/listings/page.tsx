"use client"

import { ExtraSmallListingCardProps } from "app/components/listings-cards/atoms/extra-small"
import { MediumListingCardProps } from "app/components/listings-cards/atoms/medium"
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/listings-cards/molecules/listings"
import { Button } from "app/components/ui/button"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"

export default function Page() {
    return <div className="flex container gap-4">
        <div className="w-2/3">
            <div className="max-w-xl">
                <RenderListings<MediumListingCardProps>
                    render={bodies.medium}
                    filterMethod={commonFilters[CommonFilters.Listing]()}
                    flatListProps={{
                        scrollEnabled: false,
                        ItemSeparatorComponent: () => <Separator className="w-full" />
                    }}
                />
            </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                <p className="mx-4 text-lg">Premium Listings</p>
                <RenderListings<ExtraSmallListingCardProps> render={bodies.extraSmall} filterMethod={commonFilters[CommonFilters.Premium]()} />
                <Button className="mx-4" onPress={() => { }}>
                    <Text>View all</Text>
                </Button>
            </div>
        </div>
    </div>
}