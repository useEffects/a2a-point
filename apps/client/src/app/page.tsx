import { Button } from "@/components/ui/button";
import HeroBg from "@/assets/svg/hero-bg";

export default function Home() {
  return <div className="flex justify-center container gap-4">
    <div className="top-0 bottom-0 left-0 right-0 absolute opacity-10 z-10">
      <HeroBg />
    </div>
    <div className="flex flex-col item-center justify-evenly h-[500px] gap-12 w-1/2 relative z-20">
      <div className="flex flex-col gap-4">
        <p className="text-xl md:text-3xl font-bold text-muted-foreground"> Elevate your Real Estate Game </p>
        <p className="text-3xl md:text-7xl font-bold"> The <span className="text-primary"> One Stop </span> for All Agents </p>
        <p className="text-muted-foreground">In the dynamic world of real estate, efficiency, transparency, and seamless
          collaboration are paramount. Introducing A2A POINT, a revolutionary portal
          designed exclusively for real estate agents, redefining the landscape of property
          transactions and deal management.</p>
      </div>
      <div className="flex gap-4 w-full [&>*]:w-1/2 [&>*]:rounded-full">
        <Button size={"lg"}> Browse Plans </Button>
        <Button variant={"outline"} size={"lg"}> See Testimonials </Button>
      </div>
    </div>
    <div className="w-1/2 h-[500px]">

    </div>
  </div>
}