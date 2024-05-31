"use client"

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@/components/ui/switch';
import { cn } from "app/lib/utils";
import Buildings from "src/assets/svg/buildings";
import { NewsLetter } from "src/components/news-letter";
import { Button } from "src/components/ui/button";
import { Text } from "src/components/ui/text";
import { useState } from 'react';

export default function Membership() {
    const [yearly, setYearly] = useState(false)
    return (
        <div className="flex flex-col gap-12 md:gap-40 relative">
            <div className="flex flex-col gap-12 md:gap-20 items-start container p-4">
                <div className='flex flex-col gap-4 md:flex-row justify-between w-full'>
                    <div className="flex flex-col gap-4">
                        <p className="text-3xl md:text-5xl font-bold text-primary"> Plans and Pricing </p>
                        <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, dolore? </p>
                    </div>
                    <div className='flex flex-col items-start md:items-end gap-4'>
                        <p className='text-sm text-info md:text-right'>Buy yearly plans at discounted prices</p>
                        <div className='flex flex-row gap-2 rounded-full border border-border p-4 bg-card relative z-10'>
                            <Switch checked={yearly} onCheckedChange={setYearly} />
                            {yearly ? <p className='text-primary'> Yearly </p> : <p className='text-muted-foreground'> Monthly </p>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-12 items-stretch w-full">
                    {items.map((item, key) => <div key={key} className={cn("flex flex-col gap-4 justify-between  w-full md:w-1/2 px-8 py-16 rounded-xl relative z-10 md:max-w-xs border", item.isPro ? "bg-primary text-primary-foreground" : "bg-card")}>
                        <p className={cn("text-3xl md:text-5xl font-bold", item.isPro ? "text-primary-foreground" : "text-primary")}> {yearly ? item.yearlyAmount : item.amount} </p>
                        <p className="text-xl font-bold"> {item.name} </p>
                        <p> {item.about} </p>
                        <div className="flex flex-col gap-2">
                            {item.info.map(info => <div key={info} className={cn("flex gap-2", item.isPro && "text-primary-foreground")}>
                                <FontAwesomeIcon icon={faCheck} className='text-inherit' />
                                <p className="text-inherit"> {info} </p>
                            </div>)}
                        </div>
                        <Button className="rounded-full" variant={item.isPro ? "secondary" : "default"}>
                            <Text>Choose Plan</Text>
                        </Button>
                    </div>)}
                </div>
            </div>
            <NewsLetter />
            <div className="hidden md:block absolute -top-0 bottom-auto left-auto -right-1/4 opacity-10">
                <Buildings />
            </div>
        </div>
    );
}

const items = [
    {
        amount: "$19",
        yearlyAmount: "$199",
        name: "Member",
        about: "For agent seeking a secure streamlined experience",
        info: ["Limited Access to Listings", "Per Post Charges"]
    },
    {
        amount: "$89",
        yearlyAmount: "$899",
        name: "Pro",
        about: "For agents who want to use full potential of A2A",
        info: ["Featured Listings", "Pro Badge and Logo", "Enhanced Exposure"],
        isPro: true
    }
]