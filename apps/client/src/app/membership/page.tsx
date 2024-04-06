import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck } from '@fortawesome/free-solid-svg-icons';



const items = [
    {
        amount: "$19",
        name: "Member",
        about: "For agent seeking a secure streamlined experience",
        info: ["Limited Access to Listings", "Per Post Charges"]
    },
    {
        amount: "$54",
        name: "Advanced",
        about: "Elevate presence in Real estate company",
        info: ["Unlimited Listing Posts", "Access to All Pages and Listings", "Advanced Member Badge and Logo"]
    },
    {
        amount: "$89",
        name: "Pro",
        about: "For agents who want to use full potential of A2A",
        info: ["Featured Listings", "Pro Badge and Logo", "Enhanced Exposure"]
    }
]

export default function Membership() {
    return (
        <div className="container flex">
            <div className="flex flex-col gap-8 m-8">
                <p className="text-4xl font-medium">
                    <span className="text-orange-500">Plan </span> &amp; <span className="text-blue-900">Pricing</span>
                </p>
                <div className="flex gap-8 justify-between">
                    <p className="w-1/2 font-medium">
                        An industry-first, purely usage-based pricing model, that has no entry barrier, and makes it super easy to predict your observability bills.
                    </p>
                    <div className="flex">
                        <Button className="bg-orange-500 ">Monthly</Button>
                        <Button className="bg-white"><span className="text-black">Yearly</span></Button>
                    </div>
                </div>
                <div className="container grid grid-cols-3 gap-8 m-4 rounded-lg w-full">
                    {items.map((item, i) => (
                        <div key={i} className={`flex flex-col p-4 rounded-lg  ${i < 2 ? 'bg-gray-200' : 'bg-orange-400'}`}>
                            <div className="flex flex-col gap-4 w-2/3">
                                <p><span className="text-4xl font-bold">{item.amount}</span> /month</p>
                                <p className="text-2xl font-bold">{item.name}</p>

                                <p>{item.about}</p>
                                <div className="flex flex-col gap-2 p-2">
                                    {item.info.map((infoItem, j) => (

                                        <span key={j} className="flex items-center">
                                            <FontAwesomeIcon icon={faCheck} className="mr-2 w-4 h-4" /> <span>{infoItem}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center mt-auto">
                                <Button className=" text-white rounded-full px-16 py-3">Choose Plan</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
