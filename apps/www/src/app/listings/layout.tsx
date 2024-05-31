"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { ExtraSmallListingCardProps } from "app/components/listings-cards/atoms/extra-small"
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/listings-cards/molecules/listings"
import { ArrowUpRight } from "lucide-react"
import { ReactNode } from "react"
import { LocationCards } from "app/components/listings-cards/molecules/locations"
import { useIsSmallDevice } from "@/hooks/is-small-device"

export default function ListingsLayout({ children }: { children: ReactNode }) {
    const isSmallDevice = useIsSmallDevice()

    return (
        <div className="md:container flex gap-12 h-full">
            <div className="md:w-2/3 w-full">
                {children}
            </div>
            {!isSmallDevice && <>
                <Separator className="h-full" orientation="vertical" />
                <div className="flex flex-col gap-24">
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl font-bold">Premium listings curated by <span className="text-primary">A2APoint</span></p>
                        <RenderListings<SmallListingCardProps>
                            render={bodies.small}
                            filterMethod={commonFilters[CommonFilters.Premium]()}
                            flatListProps={{
                                scrollEnabled: false,
                                className: "flex-none"
                            }}
                        />
                        <Button className="gap-4 flex flex-row items-start w-full">
                            <Text>Browse all premium listings</Text>
                            <Text><ArrowUpRight /></Text>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl font-bold">Browse popular locations</p>
                        <LocationCards
                        />
                    </div>
                </div>
            </>}
        </div>
    )
}
