"use client"

import { Feedback } from "src/lib/types"
// import Video, { VideoProps } from "next-video"
import { MoveLeft, MoveRight } from "lucide-react"
import { DetailedHTMLProps, ImgHTMLAttributes, useContext, useEffect, useState } from "react"
import { Button } from "src/components/ui/button"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "src/components/ui/carousel"
import { buildAssetUrl } from "app/lib/helpers"
import { useColorScheme } from "app/hooks/color-scheme"
import phonesDark from "@/assets/phones-dark.png"
import phonesLight from "@/assets/phones-light.png"
import { FormAutoSelect, RenderListingTileProps } from "app/components/formComponents"
import { useRouter } from "next/navigation"

export type Testimonial = Omit<Feedback, "agent"> & { user_created: { avatar: string, first_name: string, last_name: string, title: string } }

// export const VideoPlayer = (props: VideoProps) => {
//     const colors = useContext(ColorContext)

//     return colors && <Video {...props} primaryColor={colors.primary} secondaryColor={colors.background} accentColor={colors.card}>
//     </Video>
// }

export const TestimonialCarousel = ({ testimonials }: { testimonials: Testimonial[] }) => {
    const [api, setApi] = useState<CarouselApi>()

    return <Carousel setApi={setApi}>
        <CarouselContent>
            {testimonials.map((testimonial, index) => <CarouselItem key={index}>
                <div className="flex flex-col gap-8 bg-card rounded px-4 py-8">
                    <div className="w-full flex justify-center gap-4 md:gap-8 items-center">
                        <Button variant={"ghost"} onPress={() => api?.scrollPrev()} size={"icon"}>
                            <MoveLeft className="" />
                        </Button>
                        <img className="w-20 h-20 rounded-full" src={buildAssetUrl(testimonial.user_created.avatar)} alt="" />
                        <Button variant={"ghost"} onPress={() => api?.scrollNext()} size={"icon"}>
                            <MoveRight />
                        </Button>
                    </div>
                    <p className="text-subtext max-w-sm mx-auto"> {testimonial.content} </p>
                    <div className="flex flex-col gap-4 items-center">
                        <p className="text-center text-lg"> {testimonial.user_created.first_name} {testimonial.user_created.last_name} </p>
                        <p className="text-center text-subtext"> {testimonial.user_created.title} </p>
                    </div>
                </div>
            </CarouselItem>)}
        </CarouselContent>
    </Carousel>
}

export const Phones = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const { isDarkColorScheme } = useColorScheme()
    return <img {...props} src={isDarkColorScheme ? phonesDark.src : phonesLight.src} />
}

export const ListingsSearch = () => {
    const [current, setCurrent] = useState<RenderListingTileProps | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (current) {
            router.push(`/listings/${current.id}`)
        }
    }, [current])

    return <FormAutoSelect
        className="flex-0 flex-grow-0"
        currentItem={current}
        setCurrentItem={item => setCurrent(item as RenderListingTileProps)}
        item="listings"
        placeholder="Search listings!"
    />
}