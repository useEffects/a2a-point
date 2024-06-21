/* eslint-disable react/no-unescaped-entities */
import { OtpInput } from "@syeda_mehwish/react-native-otp-entry"
import { FormAutoSelect, FormInput, RenderCompanyTileProps } from "app/components/formComponents"
import { ArrowUpRight, BriefcaseBusiness, Building2, X, Phone, Shield } from "app/components/icons"
import { SeparatorText } from "app/components/separator-text"
import { Button } from "app/components/ui/button"
import { Switch } from "app/components/ui/switch"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { useColorScheme } from "app/hooks/color-scheme"
import { basicPlanStripeCodes, portfolioUrl, proPlanStripeCodes } from "app/lib/constants"
import { cn } from "app/lib/utils"
import userStore from "app/store/user"
import { parsePhoneNumber } from 'awesome-phonenumber'
import * as Linking from 'expo-linking'
import { LucideIcon } from "lucide-react-native"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { View } from "react-native"
import Collapsible from "react-native-collapsible"
import { NavigationState, Route, SceneMap, SceneRendererProps, TabView } from "react-native-tab-view"
import { Link } from "solito/link"
import { debounce, set } from "lodash"
import { Asset, withUri } from "app/components/chat-ui"
import { pickDocuments } from "app/lib/helpers"

type RegistrationContextType = {
    navigationState: NavigationState<Route>,
    setNavigationState: (state: NavigationState<Route>) => void,
    company: RenderCompanyTileProps | null,
    setCompany: (company: RenderCompanyTileProps | null) => void,
    phone: string,
    setPhone: (phone: string) => void,
    asset: Asset<withUri> | undefined,
    setAsset: (asset: Asset<withUri> | undefined) => void,
    brokerId: string,
    setBrokerId: (brokerId: string) => void
}

const RegistrationContext = createContext<RegistrationContextType>({
    navigationState: {} as NavigationState<Route>,
    setNavigationState: () => { },
    company: null,
    setCompany: () => { },
    phone: "",
    setPhone: () => { },
    asset: undefined,
    setAsset: () => { },
    brokerId: "",
    setBrokerId: () => { }
})

export const AccountConsoleScreenComponent = () => {
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: "company" },
            { key: "phoneVerification" },
            { key: "membership" },
            { key: "documentVerification" }
        ]
    })
    const [company, setCompany] = useState<RenderCompanyTileProps | null>(null)
    const [phone, setPhone] = useState("")
    const [asset, setAsset] = useState<Asset<withUri> | undefined>()
    const [brokerId, setBrokerId] = useState("")

    return <RegistrationContext.Provider value={{ navigationState, setNavigationState, company, setCompany, phone, setPhone, asset, setAsset, brokerId, setBrokerId }}>
        <TabView
            navigationState={navigationState}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={index => setNavigationState({ ...navigationState, index })}
            sceneContainerStyle={{ padding: 16, paddingTop: 0 }}
            overScrollMode={"never"}
        />
    </RegistrationContext.Provider>
}

const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    const currentIndex = props.navigationState.index
    const handleIndexChange = (index: number) => props.jumpTo(props.navigationState.routes[index]!.key)
    return <View className="flex-col gap-4 p-4">
        <View className="w-full flex-row p-2 rounded-full border border-border justify-evenly items-center">
            {props.navigationState.routes.map((route, index) => {
                const Icon = iconMap[route.key]!
                return <Button variant={"base"} size={"icon"} onPress={() => handleIndexChange(index)} key={index} className={cn("p-2 rounded-full", index === currentIndex ? "bg-primary" : "bg-transparent")}>
                    <Icon size={18} className={cn(index === currentIndex ? "text-primary-foreground" : index > currentIndex ? "text-muted-foreground" : "text-success")} />
                </Button>
            })}
        </View>
    </View>
}

const CompanyView = () => {
    const { company, setCompany, setNavigationState, navigationState } = useContext(RegistrationContext)
    const handleOnPress = async () => {
        if (company) {

        }
        setNavigationState({ ...navigationState, index: 1 })
    }

    return <View className="flex-col gap-8 flex-1">
        <View className="flex-col gap-2">
            <Text className="text-xl text-primary">Choose your company</Text>
            <Text>Connect with other real estate agents to collaborate and close deals faster.</Text>
        </View>
        <View className="flex-col gap-2">
            <FormAutoSelect
                currentItem={company}
                setCurrentItem={(val) => setCompany(val as (RenderCompanyTileProps | null))}
                item="companies"
                label="Company Name (Optional)"
                placeholder="Search for your company"
            />
            <Text className="text-subtext">Leave it blank, if you would like to continue as an individual agent</Text>
            <Text className="text-info text-sm">Feel free to contact admin if your company is not in the list</Text>
        </View>
        <Button onPress={handleOnPress} className="mt-auto mb-0">
            <Text>{company ? "Set company" : "Set as individual agent"}</Text>
        </Button>
    </View>
}

const PhoneVerificationView = () => {
    const { phone, setPhone, navigationState, setNavigationState } = useContext(RegistrationContext)
    const [error, setError] = useState<string | null>(null)
    const [triggered, setTriggered] = useState(false)
    const { colors } = useColorScheme()
    const [otp, setOtp] = useState("")
    const [verified, setVerified] = useState(false)
    const [shouldShowAgain, setShouldShowAgain] = useState(false)
    const [status, setStatus] = useState("")

    const parsedPhone = useMemo(() => parsePhoneNumber(phone, { regionCode: "IN" }), [phone])

    useEffect(() => {
        if (phone && !parsedPhone.valid) {
            setError("Invalid phone number")
        } else {
            setError(null)
        }
    }, [parsedPhone, phone])

    const sendVerificationCode = debounce(async () => {
        if (error || !parsedPhone.number) return
        setTriggered(true)
        await fetch(`${portfolioUrl}/api/phone-verify/init`, {
            method: "POST",
            body: JSON.stringify({
                phone: parsedPhone.number.e164
            }),
        })
        setTimeout(() => setShouldShowAgain(true), 30000)
    }, 5000)

    const verifyOtp = async () => {
        if (otp.length < 6 || !parsedPhone.valid || !parsedPhone.number) return
        const res = await fetch(`${portfolioUrl}/api/phone-verify/check`, {
            method: "POST",
            body: JSON.stringify({
                phone: parsedPhone.number.e164, code: otp
            })
        })
        const { status } = await res.json()
        if (status === "approved") {
            setVerified(true)
            setNavigationState({ ...navigationState, index: 2 })
        } else setStatus(status)
    }

    const handleReset = () => {
        setOtp("")
        setVerified(false)
        setTriggered(false)
        setShouldShowAgain(false)
    }

    return <ScrollView contentContainerClassName="gap-12 flex-col flex-1">
        <View className="flex-col gap-8">
            <View className="flex-col gap-2">
                <Text className="text-xl text-primary">Verify your phone number</Text>
                <Text>For integrity purposes, please verify your phone number to ensure reliable communication with other agents.</Text>
            </View>

            <View className="flex-col gap-2">
                <FormInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={verified ? parsedPhone.number!.international : phone ? phone.toString() : ""}
                    onChangeText={(val) => setPhone(val)}
                    error={error ?? ""}
                    readOnly={verified || triggered}
                />
                {verified ? <Text className="text-success text-sm">Phone number verified successfully</Text> : <></>}
            </View>
        </View>
        <Collapsible collapsed={verified || !triggered}>
            <View className="flex-col gap-8">
                <SeparatorText>
                    <Text>Enter the OTP</Text>
                </SeparatorText>
                <OtpInput
                    focusColor={colors.primary}
                    numberOfDigits={6}
                    onTextChange={(val) => setOtp(val)}
                    theme={{
                        pinCodeTextStyle: {
                            color: colors.foreground
                        },
                        pinCodeContainerStyle: {
                            borderColor: colors.foreground
                        },
                        filledPinCodeContainerStyle: {
                            borderColor: colors.success,
                        }
                    }}
                    autoFocus={false}
                />
                {shouldShowAgain ? <View className="flex-col items-center gap-2">
                    <Text className="text-subtext">Didn't receive the otp?</Text>
                    <View className="flex-row gap-4">
                        <Button onPress={handleReset} variant={"ghost"} size={"sm"}>
                            <Text>Reset</Text>
                        </Button>
                        <Button onPress={sendVerificationCode} variant={"ghost"} size={"sm"}>
                            <Text>Send again</Text>
                        </Button>
                    </View>
                </View> : <></>}
            </View>
        </Collapsible>
        {!verified ? <View className="flex-col gap-2 mt-auto mb-0">
            <Button onPress={verifyOtp}>
                <Text>{triggered ? "Verify" : "Send verification code (SMS)"}</Text>
            </Button>
            {status ? <Text className="text-destructive text-sm text-center">{status}</Text> : <></>}
        </View> : <></>}
    </ScrollView>
}

const MembershipView = () => {
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
            Linking.openURL(`${portfolioUrl}/api/pay/${basicPlanStripeCodes.monthly}/?mode=subscription&coupon=${code}&user_id=${user.id}&mobile=true`)
        } else {
            setError("Invalid coupon")
        }
    }

    return <ScrollView contentContainerClassName="flex-col gap-8">
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
    </ScrollView>
}

const DocumentVerificationView = () => {
    const { asset, setAsset, brokerId, setBrokerId } = useContext(RegistrationContext)

    const handleUploadDocument = async () => {
        const _asset = await pickDocuments({ multiple: false })
        setAsset(_asset.length ? _asset[0] : undefined)
    }

    const handleBrokerIdChange = (val: string) => {
        setBrokerId(val)
        setAsset(undefined)
    }

    return <View className="flex-col gap-12 flex-1">
        <View className="flex-col gap-2">
            <Text className="text-xl text-primary">Document Verification</Text>
            <Text className="text-subtext">Use your Dubai Govt broker ID for faster verification</Text>
            <Text className="text-warning">Either one of broker ID or document is mandatory</Text>
        </View>
        <View className="flex-col gap-8">
            <View className="flex-row items-end gap-4">
                <FormInput
                    label="Broker ID"
                    placeholder="Enter your Broker ID number"
                    value={brokerId}
                    onChangeText={handleBrokerIdChange}
                />
                <Button variant={"base"} size={"none"} className="rounded-full bg-primary p-1 mb-2">
                    <ArrowUpRight className="text-primary-foreground" />
                </Button>
            </View>
            <SeparatorText>
                <Text className="text-xs text-muted-foreground">OR</Text>
            </SeparatorText>
            <View className="flex-col gap-4">
                <Text>If you do not have broker ID, you can upload other documents to verify your account</Text>
                <Text>Accepted ID's are</Text>
                <View className="flex-row flex-wrap gap-2">
                    {["Driver's license", "Passport"].map((id, i) => <Text className="rounded-full border border-foreground py-1 px-2 text-sm" key={i}>{id}</Text>)}
                </View>
            </View>
            {asset && <View className="flex-row gap-2 items-start">
                <Button onPress={() => setAsset(undefined)} variant={"base"} size={"none"} className="p-1 rounded bg-destructive/10">
                    <X size={14} className="text-destructive" />
                </Button>
                <Text className="text-info">{asset.name}</Text>
            </View>}
            <Button variant={"outline"} size={"sm"} onPress={handleUploadDocument}>
                <Text>Upload document</Text>
            </Button>
        </View>
        <Button className="mt-auto mb-0">
            <Text>Send for verification</Text>
        </Button>
    </View>
}

const renderScene = SceneMap({
    company: () => <CompanyView key={"company"} />,
    phoneVerification: () => <PhoneVerificationView key={"phoneVerification"} />,
    membership: () => <MembershipView key={"membership"} />,
    documentVerification: () => <DocumentVerificationView key={"documentVerification"} />
})

const iconMap: {
    [key: string]: LucideIcon
} = {
    company: Building2,
    phoneVerification: Phone,
    membership: BriefcaseBusiness,
    documentVerification: Shield
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

const membershipCardItems = [
    {
        monthlyAmount: 59.98,
        yearlyAmount: 539.8,
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
        Linking.openURL(`${portfolioUrl}/api/pay/${priceId}/?mode=subscription&user_id=${user.id}&mobile=true`)
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