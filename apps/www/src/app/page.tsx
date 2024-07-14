/** @jsxImportSource react */

import { Testimonial } from "@/components/client-components/home"
import { readItems } from "@directus/sdk"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import { HalfWidthDiv } from "@/components/half-width-div"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { AppStoreButton, GooglePlayButton } from "@/components/misc-buttons"
import HeroImage from "@/components/hero-image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NewsLetter } from "@/components/news-letter"
import phones from "@/assets/phones.png";
import HeroGirl from "@/assets/hero-girl.png";
import { getCompaniesCount, getListingsCount, getLocationsCount, getUsersCount } from "app/lib/misc/queries"
import { CompanyStats } from "@/components/company-stats"

export default async function HomePage() {
    const { rest } = directusStore.getState()
    const testimonials = await queryClient.fetchQuery<Testimonial[]>({
        queryKey: ["testimonials"],
        queryFn: async () => await rest.request(readItems("portfolio", {
            fields: ["featured_testimonials.feedbacks_id.*", "featured_testimonials.feedbacks_id.user_created.avatar", "featured_testimonials.feedbacks_id.user_created.first_name", "featured_testimonials.feedbacks_id.user_created.last_name", "featured_testimonials.feedbacks_id.user_created.title"],
        })).then(data => (data as unknown as { featured_testimonials: { feedbacks_id: Testimonial }[] }).featured_testimonials?.map(({ feedbacks_id }) => feedbacks_id))
    }) ?? []
    const listingsCount = await getListingsCount()
    const usesCount = await getUsersCount()
    const companiesCount = await getCompaniesCount()
    const locationsCount = await getLocationsCount()


    return <div className="flex flex-col gap-12 md:gap-40 items-center relative">
        <HalfWidthDiv
            className="px-4 md:p-auto flex-col-reverse gap-8"
            child1={
                <div className="flex flex-col item-center justify-evenly w-full mx-auto h-full pr-4 gap-4 md:gap-12">
                    <div className="flex flex-col gap-4">
                        <p className="text-xl md:text-3xl font-bold text-subtext"> Elevate your Real Estate Game </p>
                        <p className="text-3xl md:text-7xl font-bold"> The <span className="text-primary"> One Stop </span> for All Agents </p>
                        <p className="text-subtext">In the dynamic world of real estate, efficiency, transparency, and seamless collaboration are paramount. Introducing A2A POINT, a revolutionary portal designed exclusively for real estate agents, redefining the landscape of property transactions and deal management.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-4 [&>*]:w-80 [&>*]:rounded-full">
                            <Button variant={"outline"} size={"lg"}>
                                <Text>Browse Plans</Text>
                            </Button>
                            <Button variant={"outline"} size={"lg"}>
                                <Text>View Testimonials</Text>
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4 [&>*]:w-80">
                            <GooglePlayButton size={"lg"}>
                                <Text>Download on Google Play</Text>
                            </GooglePlayButton>
                            <AppStoreButton size={"lg"}>
                                <Text>Download on App Store</Text>
                            </AppStoreButton>
                        </div>
                    </div>
                </div>
            }
            child2={
                <div className="w-full relative -z-10">
                    <HeroImage className="w-full h-full" />
                    <img src={HeroGirl.src} alt="hero-image" className="w-full h-full object-contain absolute top-0 bottom-0 right-0 left-0" />
                </div>
            }
        />
        <div className="flex flex-col md:flex-row gap-4 md:container p-4 md:p-auto">
            <div className="md:w-1/3 md:flex justify-center items-center">
                <p className="text-3xl md:text-5xl font-bold max-w-sm"> Why <span className="text-primary">choose us</span> </p>
            </div>
            <div className="md:w-2/3 md:grid grid-cols-2 justify-center items-center flex flex-col gap-4 md:gap-12 md:p-12">
                {whyChooseUs.map((item, index) => <div key={index} className="flex flex-col justify-center gap-2">
                    <p className="text-xl text-primary"> {item.title} </p>
                    <p className="text-subtext"> {item.content} </p>
                </div>)}
            </div>
        </div>
        <div className="relative">
            <HalfWidthDiv
                direction="right"
                className="p-4 gap-12"
                child1={
                    <div className="flex flex-col gap-12 w-full items-end md:pl-12">
                        <p className="text-3xl md:text-5xl font-extrabold text-right">Discover Your <span className="text-primary">Dream</span> Property</p>
                        <div className="max-w-80 flex flex-col gap-8 ml-auto mr-0 items-end">
                            <CompanyStats
                                className="gap-12"
                                right
                                counts={{
                                    listingsCount,
                                    usersCount: usesCount,
                                    companiesCount,
                                    locationsCount
                                }}
                            />
                            <p className="text-right">At A2A Point, we offer exceptional properties that exceed your expectations. Join us and explore a world of possibilities!</p>
                        </div>
                    </div>
                }
                child2={
                    <div className="md:h-[calc((50vw*9/16)+250px)]">
                        <video controls className="w-full" src="https://videos.pexels.com/video-files/3254200/3254200-uhd_3840_2160_25fps.mp4" />
                        <div className="hidden md:block absolute left-0 right-0">
                            <div className="absolute h-[250px] left-0 right-auto w-1/2 bg-card"></div>
                            <div className="container">
                                <div className="w-1/2 h-[250px] relative z-10 flex flex-col justify-evenly py-4 gap-4">
                                    <p className="text-3xl md:text-5xl font-bold"> We are <span className="text-primary">bigger</span> than you think </p>
                                    <p className="">At A2A Point, our expertise and dedication far exceed expectations. We thrive on innovation and quality.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
        <div className="container flex flex-col-reverse md:flex-row gap-8 p-4">
            <div className="md:w-1/2 flex flex-col gap-4 md:gap-12 justify-center flex-1">
                <p className="text-3xl md:text-5xl font-bold">Sign up and access our app <span className="text-primary">It&apos;s free</span></p>
                <div className="flex flex-col gap-6">
                    {steps.map((step, index) => <div className="flex flex-col gap-2" key={index}>
                        <p className="text-primary text-xl"> {step.title} </p>
                        <p className="text-subtext max-w-sm"> {step.content} </p>
                    </div>)}
                </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center items-center flex-1">
                <img src={phones.src} alt="" />
            </div>
        </div>
        <div className="container flex flex-col md:flex-row p-4">
            <div className="md:w-1/2 flex flex-col gap-4 h-full">
                <p className="text-3xl md:text-5xl font-bold text-primary"> FAQ </p>
                <p className="text-subtext">Everyting you need to know about A2APoint</p>
            </div>
            <div className="md:w-1/2">
                <Accordion type="multiple">
                    {accordionItems.map((item, index) => <AccordionItem key={index} value={index.toString()}>
                        <AccordionTrigger>
                            <Text>
                                {item.title}
                            </Text>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Text>
                                {item.content}
                            </Text>
                        </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
            </div>
        </div>
        <NewsLetter />
    </div>
}


const whyChooseUs = [
    {
        title: "Efficiency",
        content: "A2A POINT is designed to streamline the property transaction process, making it more efficient and hassle-free for agents."
    },
    {
        title: "Transparency",
        content: "Our platform ensures complete transparency in all transactions, making it easier for agents to manage deals and clients."
    },
    {
        title: "Collaboration",
        content: "A2A POINT enables seamless collaboration between agents, clients, and other stakeholders, ensuring a smooth and efficient deal management process."
    },
    {
        title: "Security",
        content: "We take security seriously and have implemented robust measures to protect your data and ensure a safe and secure experience for all users."
    }
]

const steps = [
    {
        title: "Create a Lead or Inquiry",
        content: "At A2A Point, initiate a lead or inquiry effortlessly. Our platform ensures a smooth start, connecting you with potential clients seamlessly."
    }, {
        title: "Manage Leads and Inquiries",
        content: "Efficiently manage all your leads and inquiries with our comprehensive tools. Stay organized and never miss a follow-up or update."
    }, {
        title: "Collaborate with Clients and Stakeholders",
        content: "Engage and collaborate with clients and stakeholders effectively. Our platform facilitates clear communication and productive interactions."
    }, {
        title: "Close the Deal",
        content: "Seal the deal with confidence using our robust closing tools. Ensure every transaction is smooth, secure, and successful."
    }
]

const accordionItems = [
    {
        title: "What is A2A POINT?",
        content: "A2A POINT is a revolutionary portal designed exclusively for real estate agents, redefining the landscape of property transactions and deal management."
    },
    {
        title: "How does A2A POINT work?",
        content: "A2A POINT streamlines the property transaction process, making it more efficient and hassle-free for agents. It ensures complete transparency in all transactions and enables seamless collaboration between agents, clients, and other stakeholders."
    },
    {
        title: "Is A2A POINT secure?",
        content: "We take security seriously and have implemented robust measures to protect your data and ensure a safe and secure experience for all users."
    },
    {
        title: "How can I get started with A2A POINT?",
        content: "Getting started with A2A POINT is easy. Simply sign up and access our app for free to start managing your deals and clients more efficiently."

    }
]