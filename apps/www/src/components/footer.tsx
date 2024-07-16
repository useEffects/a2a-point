import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { Button } from "src/components/ui/button"
import { Separator } from "src/components/ui/separator"

export const navItems = [
    {
        label: "Home",
        href: "/"
    },
    {
        label: "Membership",
        href: "/membership"
    },
    {
        label: "Courses",
        href: "/courses"
    },
    {
        label: "News",
        href: "/news"
    },
    {
        label: "Listings",
        href: "/listings",
        trial: true
    },
    {
        label: "Chat",
        href: "/chat",
        locked: true
    },
    {
        label: "Post",
        href: "/post",
        locked: true
    },
    {
        label: "Profile",
        href: "/profile",
        locked: true
    }
]

const footerItems = [
    {
        label: "Product",
        links: [
            {
                label: "Community",
                href: "https://community.a2apoint.com"
            },
            {
                label: "Android App",
                href: "https://mobile.a2apoint.com"
            },
            {
                label: "IOS App",
                href: "/contact"
            },
            {
                label: "Dashboard",
                href: "https://dashboard.a2apoint.com"
            },
            {
                label: "News Letter",
                href: "/newsletter"
            }
        ]
    },
    {
        label: "Site Map",
        links: navItems
    },
    {
        label: "Resources",
        links: [
            {
                label: "About Us",
                href: "/about"
            },
            {
                label: "Contact Us",
                href: "/contact"
            },
            {
                label: "Why A2A Point",
                href: "/why"
            },
        ]
    },
    {
        label: "Company",
        links: [
            {
                label: "Careers (We're Hiring)",
                href: "/api"
            },
            {
                label: "Customer Service",
                href: ""
            },
            {
                label: "Developers Contact",
                href: "https://joelsamuel.me"
            },
        ]
    }
]

const socialMediaItems = [
    {
        label: "Facebook",
        icon: faFacebook,
        href: "https://facebook.com/a2apoint"
    },
    {
        label: "Twitter",
        icon: faTwitter,
        href: "https://twitter.com/a2apoint"
    },
    {
        label: "Instagram",
        icon: faInstagram,
        href: "https://instagram.com/a2apoint"
    },
    {
        label: "LinkedIn",
        icon: faLinkedin,
        href: "https://linkedin.com/a2apoint"
    }
]

const policyItems = [
    {
        label: "Privacy Policy",
        href: "/privacy"
    },
    {
        label: "Terms of Service",
        href: "/terms"
    },
    {
        label: "License",
        href: "/license"
    }
]

export const Footer = () => {
    return <div className="bg-card pb-12 relative z-[999]">
        <Separator className="mb-12" />
        <div className="flex flex-col gap-8 container p-4 items-center">
            <div className="flex flex-col gap-8 md:flex-row w-full items-start">
                {footerItems.map((item, index) => <div key={index} className="w-full md:w-1/4 flex flex-col md:items-center gap-4">
                    <p className="font-medium text-primary"> {item.label} </p>
                    <div className="flex flex-col gap-2">
                        {item.links.map(({ label, href }, key) => <Link key={key} className="text-sm text-subtext hover:text-primary hover:underline" href={href}>
                            {label}
                        </Link>)}
                    </div>
                </div>)}
            </div>
            <Separator className="w-full" />
            <div className="flex flex-col gap-2 items-center">
                <div className="w-20 h-20 p-2 rounded-full bg-white">
                    <img className="w-full h-full" src="/icon.svg" alt="" />
                </div>
                <p className="text-primary">A2A Point</p>
                <p className="max-w-md text-sm text-primary text-center"> Elevate your Real Estate Game </p>
            </div>
            <div className="flex justify-center gap-4">
                {socialMediaItems.map((item, index) => <Link key={index} href={item.href} className="group">
                    <Button variant={"outline"} className="rounded-full" size={"icon"}>
                        <FontAwesomeIcon className="text-lg text-subtext group-hover:text-primary cursor-pointer" icon={item.icon} />
                    </Button>
                </Link>)}
            </div>
            <div className="text-subtext text-sm flex flex-col gap-4">
                <div className="flex gap-4">
                    {policyItems.map((item, index) => <Link className="hover:underline hover:text-primary" key={index} href={item.href}>
                        {item.label}
                    </Link>)}
                </div>
                <p className="text-center"> © 2024 A2A Point. All rights reserved. </p>
            </div>
        </div>
    </div>
}