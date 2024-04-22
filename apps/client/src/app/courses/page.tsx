import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import image4 from "@/assets/image4.png"
import person from "@/assets/person.png"
import roadmap from "@/assets/roadmap.png"


export default  function Courses() {
    return <div className="container flex flex-col gap-8 m-4">

        <div className="flex w-full justify-center m-4">
            <div className="flex flex-col gap-8 w-1/2">
                <p className="text-6xl font-bold w-[60%]">Real Estate and Agent Certification Courses</p>
                <Button className="w-[40%]">Start now</Button>
                <div className="flex m-4">
                    <img src={person.src} className="flex justify-left"></img>
                </div>
            </div>
            <div className="flex ">
                <img src={image4.src} className=" w-full object-contain"></img>
            </div>

        </div>

        <div className="flex justify-center m-8">
            <p  className="text-4xl font-bold " >Perks of Certification from A2A</p>
        </div>
        <img src={roadmap.src} className="m-8"></img>
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