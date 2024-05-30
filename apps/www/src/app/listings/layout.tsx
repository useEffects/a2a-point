"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { ExtraSmallListingCardProps } from "app/components/listings-cards/atoms/extra-small"
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/listings-cards/molecules/listings"
import { ArrowUpRight } from "lucide-react"
import { ReactNode } from "react"

export default function ListingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container flex gap-4 h-full min-h-screen">
            <div className="w-2/3">
                {children}
            </div>
            <Separator className="h-full" orientation="vertical" />
            <div className="flex flex-col gap-4 flex-1">
                <p className="text-2xl font-bold">Premium listings curated by <span className="text-primary">A2APoint</span></p>
                <RenderListings<ExtraSmallListingCardProps>
                    render={bodies.extraSmall}
                    filterMethod={commonFilters[CommonFilters.Premium]()}
                    flatListProps={{
                        scrollEnabled: false,
                        className: "flex-0"
                    }}
                />
                <Button className="gap-4 flex flex-row items-start w-full">
                    <Text>Browse all</Text>
                    <Text><ArrowUpRight /></Text>
                </Button>
            </div>
        </div>
    )
}
