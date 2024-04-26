import { Button } from "@/components/ui/button";
import HeroBg from "@/assets/svg/hero-bg";
import HeroGirl from "@/assets/hero-girl.png"
import HeroImage from "@/components/hero-image";
import explainingVideo from "@/assets/explaining.mp4"
import { Testimonial, TestimonialCarousel, VideoPlayer } from "@/components/client-components/home";
import { directus } from "@/lib/directus";
import { aggregate, readItems } from "@directus/sdk";
import phones from "@/assets/phones.png"
import { GridBackground } from "@/components/dot-gradient";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Feedback } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NewsLetter } from "@/components/news-letter";

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
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam animi fugiat molestias laborum deleniti natus. Voluptatum omnis aliquid accusantium tempora."
  }, {
    title: "Manage Leads and Inquiries",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam animi fugiat molestias laborum deleniti natus. Voluptatum omnis aliquid accusantium tempora."
  }, {
    title: "Collaborate with Clients and Stakeholders",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam animi fugiat molestias laborum deleniti natus. Voluptatum omnis aliquid accusantium tempora."
  }, {
    title: "Close the Deal",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam animi fugiat molestias laborum deleniti natus. Voluptatum omnis aliquid accusantium tempora."
  }
]

const getListingsCount = await directus.request(aggregate("listings", {
  aggregate: {
    count: ["*"]
  }
}))
const getUsersCount = await directus.request(aggregate("directus_users", {
  aggregate: {
    count: ["*"]
  }
}))

const listingsCount = getListingsCount?.[0].count as unknown as number
const usersCount = getUsersCount?.[0].count as unknown as number

const stats = [
  {
    title: "Listings",
    count: listingsCount
  },
  {
    title: "Users",
    count: usersCount
  }
]

const res = await directus.request(readItems("portfolio", {
  fields: ["featured_testimonials.feedbacks_id.*", "featured_testimonials.feedbacks_id.user_created.avatar", "featured_testimonials.feedbacks_id.user_created.first_name", "featured_testimonials.feedbacks_id.user_created.last_name", "featured_testimonials.feedbacks_id.user_created.title"],
})) as unknown as {
  featured_testimonials: {
    feedbacks_id: Testimonial
  }[]
}

const testimonials = res.featured_testimonials.map(item => item.feedbacks_id)

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

export default async function Home() {
  return <div className="flex flex-col gap-40 items-center relative">
    <div className="top-0 bottom-auto left-0 right-0 absolute z-10 w-screen h-screen opacity-15">
      <HeroBg className="w-full h-full" />
    </div>
    <div className="flex justify-center gap-4 container">
      <div className="flex flex-col item-center justify-evenly h-[500px] gap-12 w-1/2 relative z-20">
        <div className="flex flex-col gap-4">
          <p className="text-xl md:text-3xl font-bold text-subtext"> Elevate your Real Estate Game </p>
          <p className="text-3xl md:text-7xl font-bold"> The <span className="text-primary"> One Stop </span> for All Agents </p>
          <p className="text-subtext">In the dynamic world of real estate, efficiency, transparency, and seamless
            collaboration are paramount. Introducing A2A POINT, a revolutionary portal
            designed exclusively for real estate agents, redefining the landscape of property
            transactions and deal management.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 [&>*]:full w-1/2 [&>*]:rounded-full">
            <Button variant={"outline"} size={"lg"}> Browse Plans </Button>
            <Button variant={"outline"} size={"lg"}> See Testimonials </Button>
          </div>
          <div className="flex flex-col gap-4 [&>*]:full w-1/2">
            <Button size={"lg"}> Play Store </Button>
            <Button size={"lg"}> App Store </Button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-[500px] relative z-20">
        <HeroImage className="w-full h-full" />
        <img src={HeroGirl.src} alt="hero-image" className="w-full h-full object-contain absolute top-0 bottom-0 right-0 left-0" />
      </div>
    </div>
    <div className="flex flex-row gap-4 container">
      <div className="w-1/3 flex justify-center items-center">
        <p className="text-3xl md:text-5xl font-bold max-w-sm"> Why <span className="text-primary">choose us</span> </p>
      </div>
      <div className="w-2/3 grid grid-cols-2 justify-center items-center gap-12 p-12">
        {whyChooseUs.map((item, index) => <div key={index} className="flex flex-col justify-center gap-2">
          <p className="text-xl text-primary"> {item.title} </p>
          <p className="text-subtext"> {item.content} </p>
        </div>)}
      </div>
    </div>
    <div className="flex relative w-full">
      <div className="absolute top-0 left-0 bottom-auto right-auto w-1/2">
        <VideoPlayer src={"https://videos.pexels.com/video-files/3254200/3254200-uhd_3840_2160_25fps.mp4"}></VideoPlayer>
      </div>
      <div className="w-1/2 mt-[calc(50vw*9/16)] absolute top-0 bottom-auto right-auto h-[300px] bg-card"></div>
      <div className="w-full mt-[calc(50vw*9/16)] absolute top-0 bottom-auto right-auto h-[300px]">
        <div className="container flex h-full">
          <div className="w-1/2 p-4 flex flex-col h-full justify-evenly items-start">
            <p className="text-3xl md:text-5xl font-bold"> We are <span className="text-primary"> bigger </span> than you think </p>
            <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam animi fugiat molestias laborum deleniti natus. Voluptatum omnis aliquid accusantium tempora.</p>
          </div>
        </div>
      </div>
      <div className="flex w-full container  justify-end">
        <div className="w-1/2 flex flex-col gap-8 justify-between h-full items-center">
          <div className="max-w-sm flex gap-12 w-full">
            {stats.map((item, index) => <div key={index} className="flex flex-col items-end">
              <div className="flex items-end">
                <p className="text-3xl md:text-7xl"> {item.count} </p>
                <p className="text-xl">+</p>
              </div>
              <p className="text-subtext">{item.title}</p>
            </div>)}
          </div>
          <p className="max-w-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt, numquam ea! Fugiat dolorum facilis consectetur dicta labore, quos vel atque?</p>
          <TestimonialCarousel testimonials={testimonials} />
          <div>
          </div>
        </div>
      </div>
    </div>
    <div className="container flex">
      <div className="w-1/2 flex flex-col gap-12 justify-center flex-1">
        <p className="text-3xl md:text-5xl font-bold">Sign up and access our app <span className="text-primary">It's free</span></p>
        <div className="flex flex-col gap-6">
          {steps.map((step, index) => <div className="flex flex-col gap-2" key={index}>
            <p className="text-primary text-xl"> {step.title} </p>
            <p className="text-subtext max-w-sm"> {step.content} </p>
          </div>)}
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center flex-1">
        <img src={phones.src} alt="" />
      </div>
    </div>
    <div className="container flex">
      <div className="w-1/2 flex flex-col gap-4 h-full">
        <p className="text-3xl md:text-5xl font-bold text-primary"> FAQ </p>
        <p className="text-subtext">Everyting you need to know about A2APoint</p>
      </div>
      <div className="w-1/2">
        <Accordion type="multiple">
          {accordionItems.map((item, index) => <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger>
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              {item.content}
            </AccordionContent>
          </AccordionItem>)}
        </Accordion>
      </div>
    </div>
    <NewsLetter />
  </div >
}