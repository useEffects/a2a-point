"use client"

import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { bodies, CommonFilters, commonFilters, RenderListings } from "app/components/cards/molecules/listings";
import { MediumLocationCards } from "app/components/cards/molecules/locations";
import { Mode, RenderUsers } from "app/components/cards/molecules/users";
import { FilterKeys } from "app/screens/listings";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { Separator } from "./ui/separator";

export const HeaderContext = createContext({
    title: "" as string,
    setTitle: (newTitle: string) => { }
})

const HeaderProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState("")
    return <HeaderContext.Provider value={{ title, setTitle }}>
        {children}
    </HeaderContext.Provider>
}

function AppLayoutBase({ children }: { children: React.ReactNode }) {
    const { title } = useContext(HeaderContext)
    const pathname = usePathname()

    const Header = useCallback(() => {
        return title ? <div className="w-full flex flex-col gap-8 py-8">
            <p className="text-2xl font-bold text-primary px-4">{title}</p>
            <Separator />
        </div> : <></>
    }, [title, pathname])

    return <div className="flex flex-col flex-1">
        <Separator className="container mx-auto" />
        <div className="container mx-auto flex flex-row flex-grow px-0">
            <div className="flex-grow">
                <Header />
                <div className="max-w-xl">
                    {children}
                </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-12 min-w-md max-w-md mt-12 ml-12">
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
    </div>
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    return <HeaderProvider>
        <AppLayoutBase>
            {children}
        </AppLayoutBase>
    </HeaderProvider>
}