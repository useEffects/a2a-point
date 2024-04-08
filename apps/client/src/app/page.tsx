import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import photo from "@/assests/photo.png";


const items = [
  {
    title: "Additional Services",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit eros purus"

  },
  {
    title: "Professional Network",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit eros purus"

  },
  {
    title: "Market Knowledge",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit eros purus"

  },
  {
    title: "24 Hours Consultation",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit eros purus"

  }
]

export default function Home() {
  return <div>
    <ToggleTheme />
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold flex justify-center">Top agents</p>
      <div className="flex gap-4 m-4 justify-evenly">
        <div className="flex flex-col gap-1 border-2 border-amber-600 ">
          <div className="flex flex gap-2 m-2">
            <div className="flex">
              <img src={photo.src}></img>
            </div>
            <div className=" flex flex-col gap-2 m-4">
              <p className="text-2xl">Mr.Dale</p>
              <p>Agency name</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 m-2">

            <p className="text-4xl">$906.00</p>
            <p>Cappacale Date</p>
            <p>Coimbatore</p>
          </div>
          <div className="flex  gap-4 m-2 justify-between">
            <p>3 Bed</p>
            <p>1 Bath</p>
            <p>3000 sqft</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-2 border-amber-600 ">
          <div className="flex flex gap-2 m-2">
            <div className="flex">
              <img src={photo.src}></img>
            </div>
            <div className=" flex flex-col gap-2 m-4">
              <p className="text-2xl">Mr.Dale</p>
              <p>Agency name</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 m-2">

            <p className="text-4xl">$906.00</p>
            <p>Cappacale Date</p>
            <p>Coimbatore</p>
          </div>
          <div className="flex  gap-4 m-2 justify-between">
            <p>3 Bed</p>
            <p>1 Bath</p>
            <p>3000 sqft</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-2 border-amber-600 ">
          <div className="flex flex gap-2 m-2">
            <div className="flex">
              <img src={photo.src}></img>
            </div>
            <div className=" flex flex-col gap-2 m-4">
              <p className="text-2xl">Mr.Dale</p>
              <p>Agency name</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 m-2">

            <p className="text-4xl">$906.00</p>
            <p>Cappacale Date</p>
            <p>Coimbatore</p>
          </div>
          <div className="flex  gap-4 m-2 justify-between">
            <p>3 Bed</p>
            <p>1 Bath</p>
            <p>3000 sqft</p>
          </div>
        </div>

      </div>
    </div>
    <div className="flex flex-col m-4">
      <p className="text-2xl font-bold flex justify-center">Why choose us?</p>
      <div className="grid grid-row-2 grid-col-2 gap-4 border-2 border-amber-600 ">
        {
          items.map((item, i) => <div key={i}>
            <div>
              <p>{item.title}</p>
              <p>{item.content}</p>
            </div>

          </div>)
        }


      </div>
    </div>

  </div>
}