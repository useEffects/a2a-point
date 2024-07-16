"use client"

import Link from "next/link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu"
import Logo from "app/components/svg/logo"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"
import directusStore from "app/store/directus"
import { Button } from "./ui/button"
import { Construction, Contact, CreditCard, Home, Info, Lock, MapPin, MessageCircle, Newspaper, School, TrendingUp, Users, Menu, User, Rss } from "lucide-react"
import { GooglePlayButton, AppStoreButton } from "./misc-buttons"
import { ToggleTheme } from "./toggle-theme"
import LoginButton from "./login-button"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { useContext, useEffect } from "react"
import BottomSheet from "app/components/bottomsheet"
import { X } from "app/components/icons"
import { ConditionalRender } from "./conditional"
import { OpenContext } from "@/hooks/open"
import { Text } from "./ui/text"

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
            // {
            //     title: "About",
            //     href: "/about",
            //     description: "Learn more about us",
            //     icon: Info,
            //     locked: false
            // },
            // {
            //     title: "Contact",
            //     href: "/contact",
            //     description: "Get in touch with us",
            //     icon: Contact,
            //     locked: false
            // },
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
            },
            {
                title: "News letter",
                href: "/#news-letter",
                description: "Stay updated with our email newsletter",
                icon: Rss,
                locked: false
            },
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
                title: "Chat",
                href: "/chat",
                description: "Chat with other agents",
                icon: MessageCircle,
                locked: true,
            },
            {
                title: "Offplans",
                href: "/offplans",
                description: "View our dedicated offplans section",
                icon: Construction,
                locked: true,
            },
            {
                title: "Listings",
                href: "/listings",
                description: "Browse through our listings",
                icon: TrendingUp,
                locked: false,
            },
            {
                title: "Locations",
                href: "/locations",
                description: "View our locations",
                icon: MapPin,
                locked: false
            },
            {
                title: "Agents",
                href: "/agents",
                description: "View our agents",
                icon: Users,
                locked: false
            },
            {
                title: "Profile",
                href: "/agents/me",
                description: "View your profile",
                icon: User,
                locked: true
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

export const MobileNavbar = () => {
    const { isOpen, setIsOpen } = useContext(OpenContext)
    const pathname = usePathname()
    const { authenticated, logout } = directusStore()

    const canNavigate = (isLocked: boolean | undefined) => authenticated || !isLocked

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return isOpen && <BottomSheet open={isOpen} setOpen={setIsOpen} onBackdropPress={() => setIsOpen(false)}>
        <div className="p-4 pt-4 pb-8 flex flex-col gap-8 bg-card items-start w-full h-full justify-between">
            <div className="flex justify-between w-full">
                <div className="flex gap-4 items-center">
                    <ToggleTheme />
                    <Link href={"/"} className="text-primary no-underline text-xl font-bold">
                        A2A Point
                    </Link>
                </div>
                <Button onPress={() => setIsOpen(false)} variant={"destructive"} size={"smallIcon"} className="ml-auto mr-0">
                    <X className="text-destructive-foreground" size={14} />
                </Button>
            </div>
            <Separator className="w-full" />
            {navItems.map((item, index) => <div key={index} className="flex flex-col gap-8 w-full">
                <p className="text-lg text-foreground font-bold">{item.title}</p>
                <div className="flex flex-col gap-2 w-full">
                    {item.items.map((subItem, subIndex) => {
                        const Icon = canNavigate(subItem.locked) ? subItem.icon : Lock
                        return <div key={subIndex} className="flex">
                            <Link className={cn(pathname === subItem.href ? "text-primary no-underline" : "text-subtext hover:text-foreground", "flex gap-[1ch] items-center")} href={subItem.href}>
                                <Icon size={18} />
                                <span>{subItem.title}</span>
                            </Link>
                        </div>
                    })}
                </div>
                {index !== navItems.length - 1 && <Separator className="w-full" />}
            </div>)}
            <Separator className="w-full" />
            <LoginButton />
        </div>
    </BottomSheet>
}

const WebProductNavbar = () => {
    return <div className="flex-grow flex flex-col items-center 2xl:items-end sticky top-0 px-4 py-6 h-screen justify-between">
        <Link href={"/"} className="">
            <Button className="rounded-full" variant={"ghost"} size={"icon"}>
                <img src="/icon.svg" className="w-full h-full rounded-full" />
            </Button>
        </Link>
        <div className="translate-y-12">
            <ProductTabBar />
        </div>
        <div />
    </div>
}

const MobileProductNavbar = () => {
    return <div className="sticky top-[calc(100vh-4rem)] bottom-0 z-[100] self-end w-full bg-card">
        <ProductTabBar />
    </div>
}

export const Navbar = () => {
    const isSmallDevice = useIsSmallDevice()
    const pathName = usePathname()
    const segments = pathName.split("/")
    const isProductPathname = navItems.find(item => item.title === "Product")?.items.some(subItem => segments.length > 1 && subItem.href === `/${segments[1]}`)
    const { isOpen, setIsOpen } = useContext(OpenContext)

    const shouldShowToggleTheme = !isProductPathname && !isSmallDevice

    return isProductPathname ? <ConditionalRender mobile={<MobileProductNavbar />} large={<WebProductNavbar />} /> : <div className="flex gap-4 items-center container p-4 md:pt-12 relative z-[9999]">
        {shouldShowToggleTheme && <ToggleTheme />}
        <Link href={"/"} className="text-primary font-bold">A2APoint</Link>
        <div className="ml-auto mr-0 md:m-auto flex items-center gap-4">
            {isSmallDevice ? <Button onPress={() => setIsOpen(p => !p)} size={"icon"} variant={isOpen ? "default" : "outline"} className="rounded-full">
                <Menu size={18} className={isOpen ? "text-primary-foreground" : "text-foreground"} />
            </Button> : <WebNavbar />}
            <LoginButton />
        </div>
    </div>
}

const ProductTabBar = () => {
    const isSmallDevice = useIsSmallDevice()
    const inProductRoute = useInProductRoute()
    const router = useRouter()
    const { isOpen, setIsOpen } = useContext(OpenContext)

    const productNavItems = navItems.find(item => item.title === "Product")?.items!

    return <div className={cn("flex justify-evenly p-4 gap-4", isSmallDevice ? "flex-row w-full h-16 items-center" : "flex-col h-[250px]")}>
        {productNavItems.map((item, index) => {
            const Icon = item.icon
            const _inProductRoute = inProductRoute(item.href)
            return <Button onPress={() => router.push(item.href)} key={index} variant={_inProductRoute ? "default" : "outline"} size={"icon"} className="rounded-full">
                <Icon className={_inProductRoute ? "text-primary-foreground" : "text-foreground"} size={18} />
            </Button>
        })}
        <Button onPress={() => setIsOpen(p => !p)} size={"icon"} variant={isOpen ? "default" : "outline"} className="rounded-full">
            <Menu size={18} className={isOpen ? "text-primary-foreground" : "text-foreground"} />
        </Button>
    </div>
}

const useInProductRoute = () => {
    const pathname = usePathname()
    const segments = pathname.split("/")
    return (href: string) => !!navItems.find(item => item.title === "Product")?.items.some(subItem => segments.length > 1 && href === `/${segments[1]}`)
}