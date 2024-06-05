"use client"

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@/components/ui/switch';
import { cn } from "app/lib/utils";
import Buildings from "src/assets/svg/buildings";
import { NewsLetter } from "src/components/news-letter";
import { Button } from "src/components/ui/button";
import { Text } from "src/components/ui/text";
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useIsSmallDevice } from '@/hooks/is-small-device';
import { basicPlanStripeCodes, proPlanStripeCodes } from '@/lib/constants';
import Link from 'next/link';
import directusStore from 'app/store/directus';
import { useLogin } from '@/hooks/login';

export default function Membership() {
    const [yearly, setYearly] = useState(false)
    const isSmallDevice = useIsSmallDevice()
    const { authenticated } = directusStore()
    const handleLogin = useLogin()

    return (
        <div className="flex flex-col gap-12 md:gap-40 relative overflow-hidden">
            <div className="flex flex-col gap-12 md:gap-20 items-start container">
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
                <div className="flex flex-col md:flex-row gap-12 items-stretch w-full min-h-[300px] h-full">
                    {items.map((item, key) => <div key={key} className={cn("flex flex-col gap-6 justify-center  w-full md:w-1/2 px-8 rounded-xl relative z-10 md:max-w-xs border", item.isPro ? "bg-primary text-primary-foreground" : "bg-card")}>
                        <div className={cn("text-3xl font-bold", item.isPro ? "text-primary-foreground" : "text-primary")}>
                            {yearly ? <StrikeThrough amount={item.yearlyAmount} discount={item.yearlyDiscount} discountReason={item.discountReason} /> : <StrikeThrough amount={item.monthlyAmount} discount={item.monthlyDiscount} discountReason={item.discountReason} />}
                        </div>
                        <p className="text-xl font-bold"> {item.name} </p>
                        <p> {item.about} </p>
                        <div className="flex flex-col gap-2">
                            {item.info.map(info => <div key={info} className={cn("flex gap-2", item.isPro && "text-primary-foreground")}>
                                <FontAwesomeIcon icon={faCheck} className='text-inherit' />
                                <p className="text-inherit"> {info} </p>
                            </div>)}
                        </div>
                        <Link href={`/api/pay/${yearly ? item.yearlyProductId : item.monthlyProductId}/?mode=subscription&redirect=/`}>
                            <Button className="rounded-full w-full" variant={item.isPro ? "secondary" : "default"}>
                                <Text>Choose Plan</Text>
                            </Button>
                        </Link>
                    </div>)}
                    <Separator className='h-[500px]' orientation={isSmallDevice ? "horizontal" : "vertical"} />
                    <div className='bg-card border px-8 flex flex-col justify-center rounded-xl gap-6 flex-1 flex-grow'>
                        <div className='flex flex-col gap-4'>
                            <p className='text-primary text-3xl font-bold'> Company package </p>
                            <p>Top Selling</p>
                        </div>
                        <a href="mailto:sales@a2apoint.com" className='w-full'>
                            <Button className='w-full'>
                                <Text>
                                    Contact Sales
                                </Text>
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
            <NewsLetter />
            <div className="hidden md:block absolute -top-0 bottom-auto left-auto -right-1/4 opacity-10 -z-10">
                <Buildings />
            </div>
        </div>
    );
}

const items = [
    {
        monthlyAmount: 59.99,
        yearlyAmount: 539.8,
        monthlyDiscount: 50,
        yearlyDiscount: 50,
        discountReason: "launch offer",
        name: "Member",
        about: "For agent seeking a secure streamlined experience",
        info: ["Limited Access to Listings", "Per Post Charges"],
        monthlyProductId: basicPlanStripeCodes.monthly,
        yearlyProductId: basicPlanStripeCodes.yearly,
    },
    {
        monthlyAmount: 99.98,
        yearlyAmount: 999.8,
        monthlyDiscount: 50,
        yearlyDiscount: 50,
        discountReason: "launch offer",
        name: "Pro",
        about: "For agents who want to use full potential of A2A",
        info: ["Featured Listings", "Pro Badge and Logo", "Enhanced Exposure"],
        isPro: true,
        monthlyProductId: proPlanStripeCodes.monthly,
        yearlyProductId: proPlanStripeCodes.yearly
    }
]

const StrikeThrough = ({ amount, discount, discountReason }: { amount: number, discount: number, discountReason?: string }) => {
    const discountedAmount = Math.round((discount / 100) * amount * 100) / 100
    return !discount ? <span>AED {amount}</span> : <div>
        <div className='flex gap-[0.5ch]'>
            <span>AED</span>
            <span className='line-through'>{amount}</span>
            <span>{discountedAmount}</span>
        </div>
        {discountReason && <p className='text-base font-normal'> {discountReason} </p>}
    </div>
}