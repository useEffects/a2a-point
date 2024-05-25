import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from "app/lib/utils";
import Buildings from "src/assets/svg/buildings";
import { NewsLetter } from "src/components/news-letter";
import { Button } from "src/components/ui/button";
import { Text } from "src/components/ui/text";

export default function Membership() {
    return (
        <div className="container flex flex-col gap-40 relative">
            <div className="flex flex-col gap-20">
                <div className="flex flex-col gap-4">
                    <p className="text-3xl md:text-5xl font-bold text-primary"> Plans and Pricing </p>
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, dolore? </p>
                </div>
                <div className="flex justify-evenly items-stretch w-full">
                    {items.map((item, key) => <div key={key} className={cn("flex flex-col gap-4 justify-between w-1/3 px-4 py-16 rounded-xl relative z-10 max-w-xs border", isLast(key) ? "bg-primary text-primary-foreground" : "bg-card")}>
                        <p className={cn("text-3xl md:text-5xl font-bold", isLast(key) ? "text-primary-foreground" : "text-primary")}> {item.amount} </p>
                        <p className="text-xl font-bold"> {item.name} </p>
                        <p> {item.about} </p>
                        <div className="flex flex-col gap-2">
                            {item.info.map(info => <div key={info} className="flex gap-2">
                                <FontAwesomeIcon icon={faCheck} />
                                <p className="text-subtext"> {info} </p>
                            </div>)}
                        </div>
                        <Button className="rounded-full" variant={isLast(key) ? "secondary" : "default"}>
                            <Text>Choose Plan</Text>
                        </Button>
                    </div>)}
                </div>
            </div>
            <NewsLetter />
            <div className="absolute -top-0 bottom-auto left-auto -right-1/4 opacity-20">
                <Buildings />
            </div>
        </div>
    );
}

const isLast = (index: number) => index === items.length - 1

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