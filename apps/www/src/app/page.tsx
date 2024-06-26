"use client"

import HeroGirl from "@/assets/hero-girl.png";
import HeroImage from "app/components/svg/hero";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
// import explainingVideo from "@/assets/explaining-video.mp4"
import phones from "@/assets/phones.png";
import { aggregate, readItems } from "@directus/sdk";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Testimonial, TestimonialCarousel } from "src/components/client-components/home";
import { HalfWidthDiv } from "src/components/half-width-div";
import { NewsLetter } from "src/components/news-letter";
import { AppStoreButton, GooglePlayButton } from "@/components/misc-buttons";
import { useEffect, useState } from "react";
import directusStore from "app/store/directus";
import { useQuery } from "@tanstack/react-query";
import { CompanyStats } from "app/components/company-stats";

export default function Home() {

  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const { rest } = directusStore()

  const { data: testimonialsRes } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => await rest.request(readItems("portfolio", {
      fields: ["featured_testimonials.feedbacks_id.*", "featured_testimonials.feedbacks_id.user_created.avatar", "featured_testimonials.feedbacks_id.user_created.first_name", "featured_testimonials.feedbacks_id.user_created.last_name", "featured_testimonials.feedbacks_id.user_created.title"],
    })) as unknown as {
      featured_testimonials: {
        feedbacks_id: Testimonial
      }[]
    }
  })

  useEffect(() => {
    if (testimonialsRes) {
      const testimonials = testimonialsRes.featured_testimonials.map(item => item.feedbacks_id)
      setTestimonials(testimonials)
    }
  }, [testimonialsRes])

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
        <div className="w-full relative">
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
              <CompanyStats className="gap-12" right />
              <p className="text-right">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt, numquam ea! Fugiat dolorum facilis consectetur dicta labore, quos vel atque?</p>
            </div>
          </div>
        }
        child2={
          <div className="md:h-[calc((50vw*9/16)+200px)]">
            <video controls className="w-full" src="https://videos.pexels.com/video-files/3254200/3254200-uhd_3840_2160_25fps.mp4" />
            <div className="hidden md:block absolute left-0 right-0">
              <div className="absolute h-[200px] left-0 right-auto w-1/2 bg-card"></div>
              <div className="container">
                <div className="w-1/2 h-[200px] relative z-10 flex flex-col justify-evenly py-4">
                  <p className="text-3xl md:text-5xl font-bold"> We are <span className="text-primary">bigger</span> than you think </p>
                  <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, delectus.</p>
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