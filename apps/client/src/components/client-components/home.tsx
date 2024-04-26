"use client"

import { ColorContext } from "@/context/color"
import { Feedback } from "@/lib/types"
import Video, { VideoProps } from "next-video"
import { useContext, useState } from "react"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel"
import { Button } from "../ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLongArrowLeft, faLongArrowRight } from "@fortawesome/free-solid-svg-icons"

export type Testimonial = Omit<Feedback, "agent"> & { user_created: { avatar: string, first_name: string, last_name: string, title: string } }

export const VideoPlayer = (props: VideoProps) => {
    const colors = useContext(ColorContext)

    return <Video {...props} primaryColor={colors.primary} secondaryColor={colors.background} accentColor={colors.card}>
    </Video>
}

export const TestimonialCarousel = ({ testimonials }: { testimonials: Testimonial[] }) => {
    const [api, setApi] = useState<CarouselApi>()

    return <Carousel setApi={setApi} className="max-w-sm">
        <CarouselContent>
            {testimonials.map((testimonial, index) => <CarouselItem key={index}>
                <div className="flex flex-col gap-8 bg-card rounded px-4 py-8">
                    <div className="w-full flex justify-center gap-8 items-center">
                        <Button variant={"outline"} onClick={() => api?.scrollPrev()} size={"icon"}>
                            <FontAwesomeIcon icon={faLongArrowLeft} />
                        </Button>
                        <img className="w-20 h-20 rounded-full" src={`/api/directus/${testimonial.user_created.avatar}`} alt="" />
                        <Button variant={"outline"} onClick={() => api?.scrollNext()} size={"icon"}>
                            <FontAwesomeIcon icon={faLongArrowRight} />
                        </Button>
                    </div>
                    <p className="text-subtext"> {testimonial.content} </p>
                    <div className="flex flex-col gap-4 items-center">
                        <p className="text-center text-lg"> {testimonial.user_created.first_name} {testimonial.user_created.last_name} </p>
                        <p className="text-center text-subtext"> {testimonial.user_created.title} </p>
                    </div>
                </div>
            </CarouselItem>)}
        </CarouselContent>
    </Carousel>

}