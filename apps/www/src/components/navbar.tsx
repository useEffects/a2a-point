"use client"

import Link from "next/link"
// import { useMediaQuery } from "@uidotdev/usehooks"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu"
import Logo from "app/components/svg/logo"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"
import directusStore from "app/store/directus"
import { Button } from "./ui/button"
import { Lock } from "lucide-react"
import { GooglePlayButton, AppStoreButton } from "./misc-buttons"
import { Text } from "./ui/text"
import { ToggleTheme } from "./toggle-theme"
import LoginButton from "./login-button"

const navItems = [
    {
        title: "Company",
        items: [
            {
                title: "Home",
                href: "/",
                description: "Get started with A2A Point"
            },
            {
                title: "About",
                href: "/about",
                description: "Learn more about us"
            },
            {
                title: "Contact",
                href: "/contact",
                description: "Get in touch with us"
            },
            {
                title: "News and Feeds",
                href: "/news",
                description: "Stay updated with our news and feeds"
            },
            {
                title: "Membership",
                href: "/membership",
                description: "Join us today!"
            },
            {
                title: "Courses",
                href: "/courses",
                description: "Learn more about our courses"
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
                description: "Browse through our listings"
            },
            {
                title: "Profile",
                href: "/profile",
                description: "View your profile",
                locked: true
            },
            {
                title: "Post",
                href: "/post",
                description: "Post a listing in our platform",
                locked: true
            },
            {
                title: "Chat",
                href: "/chat",
                description: "Chat with other agents",
                locked: true
            }
        ],
        component: <div className="w-1/2 flex flex-col gap-4 justify-center bg-card p-4 rounded-xl">
            {/* <Button className="w-full items-start" size={"lg"} variant={"outline"}>
                <Text>Open dashboard</Text>
            </Button>
            <Separator className="w-full" /> */}
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
                            <>
                                <Button variant={"base"} size={"none"} className={cn("p-4 items-start w-full rounded flex flex-row justify-start gap-4", subItem.href === pathname && "bg-card")} onPress={() => router.push(subItem.href)} disabled={!canNavigate(subItem.locked)}>
                                    {!canNavigate(subItem.locked) && <Lock className="w-6 h-6" />}
                                    <div className="flex flex-col items-start">
                                        <p className="text-lg">{subItem.title}</p>
                                        {subItem.description && <p className="text-subtext text-base">{subItem.description}</p>}
                                    </div>
                                </Button>
                                <Separator className="w-full" />
                            </>
                        </NavigationMenuLink>)}
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
            )}
        </NavigationMenuList>
    </NavigationMenu>
}

const MobileNavbar = () => {
    return <div>

    </div>
}

export const Navbar = () => {
    // const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
    return false ? <MobileNavbar /> : <div className="flex gap-4 items-center container pt-12">
        <ToggleTheme />
        <Link href={"/"} className="text-primary font-bold">A2APoint</Link>
        <WebNavbar />
        <LoginButton />
    </div>
}