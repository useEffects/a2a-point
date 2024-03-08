"use client"
import a2a from "@/assests/a2a.png"
import { Button } from "@/components/ui/button"

const sidebar=["Dashboard","Courses","News","Pricing","Contact Us"]
const  items=["View all","Trending","Properties","Announcements","News","Events","Analytics"]

export default function News() {
    return <div className="flex flex-col gap-4 m-4">
        <div className="flex justify-between m-4 ">
            <img src={a2a.src} className="w-32 object-contain"></img>
            <div className="flex gap-8 jutsify-evenly">
                {
                sidebar.map((item,i)=><div key={i}>{item}

                </div>)
                }
            </div>
            <div className="flex gap-8">
                <Button>Login</Button>
                <Button>Signin</Button>
            </div>
        </div>
        <div className="flex flex-col items-center gap-4 m-4">
            <p className="text-6xl">News and insights</p>
            <p className="container max-w-full">Learn about Real Estate, Marketing, and Property Insight, discover latest product updates, partnership announcements, user stories,
                and more.</p>
        </div>
        <div className="flex justify-center m-4">
            <div className="flex gap-4">
                {
                    items.map((item,i)=><div key={i}>{item}</div>)
                }
            </div>

        </div>

    </div>
}