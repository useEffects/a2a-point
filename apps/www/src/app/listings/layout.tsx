"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { useIsSmallDevice } from "@/hooks/is-small-device"
import { SmallListingCardProps } from "app/components/cards/atoms/small"
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings"
import { SmallLocationCards } from "app/components/cards/molecules/locations"
import { ArrowUpRight } from "lucide-react"
import { ReactNode } from "react"

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
                            filter={commonFilters[CommonFilters.Premium]()}
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
                        <SmallLocationCards
                        />
                    </div>
                </div>
            </>}
        </div>
    )
}
