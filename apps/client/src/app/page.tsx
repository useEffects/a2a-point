import { GridBackground } from "@/components/dot-gradient";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import hero from '@/assets/hero.png';
import hero2 from "@/assets/hero2.png";
import HeroBg from "@/assets/svg/hero-bg";

const heroSideCardProps = [
  {
    label: "Properties",
    value: "100",
  },
  {
    label: "Agents",
    value: "100",
  },
  {
    label: "Transactions",
    value: "100",
  }
]

const HeroSideCard = ({ label, value }: { label: string, value: string }) => {
  return <div className="rounded-lg border border-solid p-2 backdrop-blur-lg shadow-lg">
    <p className="text-sm">{label}</p>
    <p className="font-extrabold text-primary">{value}</p>
  </div>
}

export default function Home() {
  return <div className="flex justify-center container gap-4">
    <div className="top-0 bottom-0 left-0 right-0 absolute opacity-10 z-10">
      <HeroBg />
    </div>
    <div className="flex flex-col item-center justify-center gap-12 w-1/2 relative z-20">
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
    {/* <GridBackground className="w-1/2 h-[calc(100vh-12rem)] max-h-[900px] p-4"> */}
      {/* <div className="flex w-full h-full">
        <div className="w-full h-full flex flex-col relative">
          <div className="flex-grow absolute z-10 flex flex-col gap-4 left-auto -right-4">
            {heroSideCardProps.map((props, index) => <HeroSideCard key={index} {...props} />)}
          </div>
          <div className="border-4 border-primary rounded m-4 backdrop-blur-sm shadow-lg mt-auto mb-4">
            <img src={hero2.src} className="w-full h-full object-contain" alt="" />
          </div>
        </div>
        <div className="h-2/3 aspect-[2/3] rounded-full bg-primary shadow-lg">
          <img src={hero.src} className="object-fill h-full w-full rounded-full" alt="" />
        </div>
      </div> */}
    {/* </GridBackground> */}
  </div>
}