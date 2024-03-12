"use client"
import a2a from "@/assests/a2a.png"
import home from "@/assests/home.png"
import image1 from "@/assests/image1.png"
import image2 from "@/assests/image2.png"
import image3 from "@/assests/image3.png"
import directus from "@/lib/directus"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { readItems } from "@directus/sdk"


const sidebar = ["Dashboard", "Courses", "News", "Pricing", "Contact Us"]
const items = ["View all", "Trending", "Properties", "Announcements", "News", "Events", "Analytics"]
const data = [
    {
        photo: image1,
        title: "Trending",
        time: "5 min read",
        heading: "A beginner's guide to real Estate",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam pariatur saepe quidem minima, ea dolorem non eveniet dicta quibusdam."

    },
    {
        photo: image2,
        title: "News",
        time: "5 min read",
        heading: "A beginner's guide to real Estate",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam pariatur saepe quidem minima, ea dolorem non eveniet dicta quibusdam."

    },
    {
        photo: image3,
        title: "Events",
        time: "5 min read",
        heading: "A beginner's guide to real Estate",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam pariatur saepe quidem minima, ea dolorem non eveniet dicta quibusdam."

    },
    {
        photo: image2,
        title: "News",
        time: "5 min read",
        heading: "A beginner's guide to real Estate",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam pariatur saepe quidem minima, ea dolorem non eveniet dicta quibusdam."

    },
    {
        photo: image1,
        title: "Trending",
        time: "5 min read",
        heading: "A beginner's guide to real Estate",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam pariatur saepe quidem minima, ea dolorem non eveniet dicta quibusdam."

    },
    {
        photo: image3,
        title: "Events",
        time: "5 min read",
        heading: "A beginner's guide to real Estate",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam pariatur saepe quidem minima, ea dolorem non eveniet dicta quibusdam."

    }
]

export default function News() {

    const [item, setItems] = useState([]);

    useEffect(() => {
    const fetchArticles = async () => {
        try {
            const response = await directus.request(readItems('articles'));
            // setItems(response.);
            console.log(response)
        
        } catch (error) {
            console.error('Error fetching articles:', error);
            
        }
    };
    fetchArticles();
    
}, []);



return <div className="container flex flex-col gap-8 m-4">
    <div className="flex justify-between m-4 ">
        <img src={a2a.src} className="w-32 object-contain"></img>
        <div className="flex gap-8 jutsify-evenly">
            {
                sidebar.map((item, i) => <div key={i}>{item}

                </div>)
            }
        </div>
        <div className="flex gap-8">
            <Button>Login</Button>
            <Button>Signin</Button>
        </div>
    </div>
    <div className="flex flex-col items-center gap-4 m-4">
        <p className="text-6xl font-bold">News and insights</p>
        <p className=" max-w-lg text-center">Learn about Real Estate, Marketing, and Property Insight, discover latest product updates, partnership announcements, user stories,
            and more.</p>
    </div>
    <div className="flex justify-center m-4">
        <div className="flex gap-4">
            {
                items.map((item, i) => <div key={i}>{item}
                </div>)
            }
        </div>

    </div>
    <div className="flex w-full h-[400px] justify-center">
        <div className="w-1/2 h-full ">
            <img src={home.src} className="h-full object-contain"></img>
        </div>
        <div className="flex flex-col gap-4 w-1/2 h-full border-solid border-[1px]">
            <div className="flex gap-8 m-4">
                <p className="">News</p>
                <p className="font-bold">5 min read</p>
            </div>
            <div className="flex flex-col gap-4 m-4">
                <p className="text-4xl">There is a property where you can invest</p>
                <p>Whether you're searching for a cozy apartment in the heart of the city, a charming suburban house with a spacious backyard, or a luxurious waterfront estate, we have something to suit every taste and lifestyle.</p>
            </div>
            <Button className="w-32 object-contain m-8">Read More &nbsp; &gt;</Button>
        </div>
    </div>
    <div className="grid grid-rows-2 grid-cols-3 gap-8 ">
        {
            data.map((item, i) => <div key={i} className="flex flex-col gap-4 m-4" >
                <img src={item.photo.src}></img>
                <div className="flex gap-4">
                    <p>{item.title}</p>
                    <p>{item.time}</p>
                </div>
                <p className="text-2xl font-bold">{item.heading}</p>
                <p>{item.content}</p>
                <Button className="w-32 object-contain">Read More &nbsp; &gt;</Button>
            </div>)
        }

    </div>
    <div className="flex flex-col items-center gap-8 ">
        <p className="text-4xl">Stay in the loop</p>
        <p className="container max-w-xl">Subscribe to our newsletter to receive the latest updates on the A2A and stay informed about Certification trends. Don’t miss out the magic!</p>
        <div className="flex gap-1">
            <Input type="email" name="email" required placeholder="name@gmail.com"></Input>
            <Button>Subscribe</Button>

        </div>

    </div>



</div>
}