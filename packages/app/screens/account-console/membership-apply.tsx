import { basicPlanStripeCodes, portfolioUrl, proPlanStripeCodes } from "app/lib/constants"
import userStore from "app/store/user"
import { useState } from "react"
import { View } from "react-native"
import * as Linking from "expo-linking"
import { Text } from "app/components/ui/text"
import { Link } from "solito/link"
import { Button } from "app/components/ui/button"
import { FormInput } from "app/components/formComponents"
import { ArrowUpRight } from "app/components/icons"
import { SeparatorText } from "app/components/separator-text"
import { Switch } from "app/components/ui/switch"
import { cn } from "app/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "app/components/ui/card"
import { Header } from "app/components/header"

export const MembershipApplyScreenComponent = () => {
    const { user } = userStore()
    const [code, setCode] = useState("")
    const [yearly, setYearly] = useState(false)
    const [error, setError] = useState("")

    const checkCoupon = async () => {
        const res = await fetch(`${portfolioUrl}/api/check-coupon/${code}`)
        return res.status === 200
    }

    const checkoutWithCoupon = async () => {
        if (!code) {
            setError("Please enter a coupon code")
            return
        }
        const isValid = await checkCoupon()
        if (isValid) {
            setError("")
            Linking.openURL(`${portfolioUrl}/api/pay/${basicPlanStripeCodes.monthly}/?mode=subscription&coupon=${code}&user_id=${user.id}&isMobile=true`)
        } else {
            setError("Invalid coupon")
        }
    }

    return <View className="flex-1">
        <View className="mb-4 w-full">
            <Header>
                <Text className="text-xl font-bold">Membership</Text>
            </Header>
        </View>
        {user.plan ? <View className="flex-col gap-2 flex-grow">
            <Card className="mb-0 mt-auto">
                <CardHeader>
                    <CardTitle className="text-lg text-success">
                        Membership active
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Text>You are currently subscribed to <Text className="text-info">{user.plan}</Text> plan</Text>
                </CardContent>
                <CardFooter>
                    <Text className="text-subtext">For invoice or billing details contact support</Text>
                </CardFooter>
            </Card>
        </View> : <View className="flex-col gap-8">
            <Text className="text-xl text-primary">Membership plan</Text>
            <View className="flex-col gap-4">
                <View>
                    <Text className="text-success">Have access code from your company?</Text>
                    <Link href={`${portfolioUrl}/membership`}>
                        <Button variant={"base"} size={"none"} className="flex-row justify-start">
                            <Text className="underline text-info">Learn more</Text>
                        </Button>
                    </Link>
                </View>
                <View className="flex-row gap-4 w-full items-end">
                    <FormInput
                        label="Access Code"
                        placeholder="Enter your access code"
                        value={code}
                        onChangeText={(val) => setCode(val)}
                        error={error}
                        rightComponent={() => <Button onPress={checkoutWithCoupon} variant={"base"} size={"none"} className="rounded-full bg-primary p-1">
                            <ArrowUpRight className="text-primary-foreground" />
                        </Button>}
                    />
                </View>
            </View>
            <SeparatorText>
                <Text className="text-muted-foreground text-sm">OR</Text>
            </SeparatorText>
            <View className="flex-col gap-2 items-end">
                <Button variant={"base"} size={"none"} className="flex-row gap-2 rounded-full border border-border p-1 bg-card items-center">
                    <Switch checked={yearly} onCheckedChange={setYearly} />
                    {yearly ? <Text className="text-primary"> Yearly </Text> : <Text className="text-muted-foreground text-sm"> Monthly </Text>}
                </Button>
                <Text className="text-info text-sm">Buy yearly plans at discounted prices</Text>
            </View>
            {membershipCardItems.map((membershipCardItem, i) => <MembershipCard key={i} {...membershipCardItem} isYearly={yearly} />)}
        </View>}
    </View>
}

type MembershipCardProps = {
    name: string,
    about: string,
    info: string[],
    monthlyAmount: number,
    yearlyAmount: number,
    monthlyDiscount: number,
    yearlyDiscount: number,
    discountReason: string,
    isPro?: boolean,
    monthlyPriceId: string,
    yearlyPriceId: string
}

export const membershipCardItems = [
    {
        monthlyAmount: 59.98,
        yearlyAmount: 599.8,
        monthlyDiscount: 50,
        yearlyDiscount: 50,
        discountReason: "launch offer",
        name: "Basic",
        about: "For agent seeking a secure streamlined experience",
        info: ["Limited Access to Listings", "Per Post Charges"],
        monthlyPriceId: basicPlanStripeCodes.monthly,
        yearlyPriceId: basicPlanStripeCodes.yearly,
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
        monthlyPriceId: proPlanStripeCodes.monthly,
        yearlyPriceId: proPlanStripeCodes.yearly
    }
]

export const MembershipCard = ({ name, about, info, monthlyAmount, yearlyAmount, monthlyDiscount, yearlyDiscount, discountReason, isPro, monthlyPriceId, yearlyPriceId, isStatic, isYearly }: MembershipCardProps & { isStatic?: boolean, isYearly?: boolean }) => {
    const { user } = userStore()

    const checkout = async () => {
        const priceId = isYearly ? yearlyPriceId : monthlyPriceId
        Linking.openURL(`${portfolioUrl}/api/pay/${priceId}/?mode=subscription&user_id=${user.id}&isMobile=true`)
    }

    const discount = isYearly ? yearlyDiscount : monthlyDiscount
    const amount = isYearly ? yearlyAmount : monthlyAmount
    const discountedAmount = Math.round((discount / 100) * amount * 100) / 100
    const fg = isPro ? "text-primary-foreground" : "text-primary"
    const bg = isPro ? "bg-primary" : "bg-card"

    return <View className={cn("flex-row gap-8 p-4 rounded-xl border border-border", bg)}>
        <View className="w-36 flex-col gap-4">
            <Text className={cn("font-medium text-lg", fg)}>{name}</Text>
            {!discount ? <Text>AED {amount}</Text> : <View>
                <View className='flex-row gap-1 items-center'>
                    <Text className={cn(fg)}>AED</Text>
                    <Text className={cn("line-through", fg)}>{amount}</Text>
                    <Text className={cn("font-medium text-xl", fg)}>{discountedAmount}</Text>
                </View>
                {discountReason && <Text className={cn(fg)}> {discountReason} </Text>}
            </View>}
        </View>
        <View className="flex-col gap-4 flex-grow">
            <View className="flex-row">
                <Text className={cn("flex-1 flex-wrap")}>{about}</Text>
            </View>
            <View className="flex-col gap-1">
                {info.map((item, i) => <Text key={i} className="">{item}</Text>)}
            </View>
            {!isStatic ? <Button onPress={checkout} variant={"secondary"} size={"sm"}>
                <Text>Choose plan</Text>
            </Button> : <></>}
        </View>
    </View>
}