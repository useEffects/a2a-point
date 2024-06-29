"use client"

import Link from "next/link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu"
import Logo from "app/components/svg/logo"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"
import directusStore from "app/store/directus"
import { Button } from "./ui/button"
import { Construction, Contact, CreditCard, Home, Info, Lock, MapPin, MessageCircle, Newspaper, School, TrendingUp, Users } from "lucide-react"
import { GooglePlayButton, AppStoreButton } from "./misc-buttons"
import { ToggleTheme } from "./toggle-theme"
import LoginButton from "./login-button"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { useState } from "react"
import { Menu } from "lucide-react"
import BottomSheet from "app/components/bottomsheet"
import { X } from "app/components/icons"

export const navItems = [
    {
        title: "Company",
        items: [
            {
                title: "Home",
                href: "/",
                description: "Get started with A2A Point",
                icon: Home,
                locked: false
            },
            {
                title: "About",
                href: "/about",
                description: "Learn more about us",
                icon: Info,
                locked: false
            },
            {
                title: "Contact",
                href: "/contact",
                description: "Get in touch with us",
                icon: Contact,
                locked: false
            },
            {
                title: "News and Feeds",
                href: "/news",
                description: "Stay updated with our news and feeds",
                icon: Newspaper,
                locked: false
            },
            {
                title: "Membership",
                href: "/membership",
                description: "Join us today!",
                icon: CreditCard,
                locked: false
            },
            {
                title: "Courses",
                href: "/courses",
                description: "Learn more about our courses",
                icon: School,
                locked: false
            }
        ],
        component: <div className="bg-card bg-rounded px-4 py-12 flex flex-col w-1/2 gap-12 rounded-xl">
            <div className="p-8 mx-auto rounded-full bg-light w-2/3 aspect-1">
                <Logo className="w-full h-full" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
                <p className="text-3xl font-extrabold text-primary"> A2APoint </p>
                <p className="text-subtext">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat ut pariatur velit neque deserunt consequatur? Autem repellendus vero perferendis nesciunt.</p>
            </div>
        </div>
    }, {
        title: "Product",
        items: [
            {
                title: "Listings",
                href: "/listings",
                description: "Browse through our listings",
                icon: TrendingUp
            },
            {
                title: "Locations",
                href: "/locations",
                description: "View our locations",
                icon: MapPin
            },
            {
                title: "Agents",
                href: "/agents",
                description: "View our agents",
                icon: Users
            },
            {
                title: "Post",
                href: "/post",
                description: "Post a listing in our platform",
                icon: Construction,
                locked: true,
            },
            {
                title: "Chat",
                href: "/chat",
                description: "Chat with other agents",
                icon: MessageCircle,
                locked: true,
            }
        ],
        component: <div className="w-1/2 flex flex-col gap-4 justify-center bg-card p-4 rounded-xl">
            <p className="text-lg font-bold">Install our mobile apps!</p>
            <GooglePlayButton size={"lg"} className="w-full items-start">Download on Google Play</GooglePlayButton>
            <AppStoreButton size={"lg"} className="w-full items-start">Download on App Store</AppStoreButton>
        </div>
    }
]

const WebNavbar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { authenticated } = directusStore()
    const canNavigate = (isLocked: boolean | undefined) => authenticated || !isLocked

    return <NavigationMenu className="">
        <NavigationMenuList>
            {navItems.map((item, index) => <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>
                    {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="flex md:!w-[800px] p-4 gap-4">
                    {item.component}
                    <div className="flex-1 flex-col flex w-1/2">
                        {item.items.map((subItem, subIndex) => <NavigationMenuLink asChild key={subIndex}>
                            <div className="block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <Button variant={"base"} size={"none"} className={cn("p-4 items-start w-full rounded flex flex-row justify-start gap-4", subItem.href === pathname && "bg-card")} onPress={() => router.push(subItem.href)} disabled={!canNavigate(subItem.locked)}>
                                    {!canNavigate(subItem.locked) && <Lock className="w-6 h-6" />}
                                    <div className="flex flex-col items-start gap-2">
                                        <p className="font-medium">{subItem.title}</p>
                                        {subItem.description && <p className="text-subtext">{subItem.description}</p>}
                                    </div>
                                </Button>
                                <Separator className="w-full" />
                            </div>
                        </NavigationMenuLink>)}
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
            )}
        </NavigationMenuList>
    </NavigationMenu>
}

const MobileNavbar = () => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const { authenticated } = directusStore()

    const canNavigate = (isLocked: boolean | undefined) => authenticated || !isLocked

    return open ? <BottomSheet open={open} setOpen={setOpen} onBackdropPress={() => setOpen(false)}>
        <div className="p-4 flex flex-col gap-8 bg-popover items-start">
            <Button variant={"destructive"} size={"smallIcon"} className="ml-auto mr-0">
                <X className="text-foreground" size={14} />
            </Button>
            {navItems.map((item, index) => <div key={index}>
                <p className="text-lg text-foreground font-bold">{item.title}</p>
                {item.items.map((subItem, subIndex) => <div key={subIndex}>
                    <Link className={cn(pathname === subItem.href ? "text-primary underline" : "text-subtext")} href={subItem.href}>{subItem.title}</Link>
                </div>)}
                {index !== navItems.length - 1 && <Separator className="w-full" />}
            </div>)}
        </div>
    </BottomSheet> : <Menu onClick={() => setOpen(true)} />
}

const WebProductNavbar = () => {
    return <div className="flex-grow flex flex-col items-center 2xl:items-end sticky top-0 px-4 py-6 h-screen justify-between">
        <Link href={"/"} className="text-primary font-bold text-xl">A2APoint</Link>
        <div className="-translate-y-12">
            <ProductTabBar />
        </div>
        <LoginButton />
    </div>
}

export const Navbar = () => {
    const isSmallDevice = useIsSmallDevice()
    const pathName = usePathname()
    const segments = pathName.split("/")
    const isProductPathname = navItems.find(item => item.title === "Product")?.items.some(subItem => segments.length > 1 && subItem.href === `/${segments[1]}`)
    return isProductPathname ? (isSmallDevice ? <></> : <WebProductNavbar />) : <div className="flex gap-4 items-center container p-4 md:pt-12 relative z-[9999]">
        <ToggleTheme />
        <Link href={"/"} className="text-primary font-bold">A2APoint</Link>
        <div className="ml-auto mr-0 md:m-auto flex items-center gap-4">
            {isSmallDevice ? <MobileNavbar /> : <WebNavbar />}
            <LoginButton />
        </div>
    </div>
}

const ProductTabBar = () => {
    const isSmallDevice = useIsSmallDevice()
    const inProductRoute = useInProductRoute()
    const router = useRouter()

    const productNavItems = navItems.find(item => item.title === "Product")?.items!
    return <div className={cn("flex justify-between h-[250px] p-4 gap-4", isSmallDevice ? "flex-row" : "flex-col")}>
        {productNavItems.map((item, index) => {
            const Icon = item.icon
            const _inProductRoute = inProductRoute(item.href)
            return <Button onPress={() => router.push(item.href)} key={index} variant={_inProductRoute ? "default" : "outline"} size={"icon"} className="rounded-full">
                <Icon className={_inProductRoute ? "text-primary-foreground" : "text-foreground"} size={18} />
            </Button>
        })}
    </div>
}

const useInProductRoute = () => {
    const pathname = usePathname()
    const segments = pathname.split("/")
    return (href: string) => !!navItems.find(item => item.title === "Product")?.items.some(subItem => segments.length > 1 && href === `/${segments[1]}`)
}