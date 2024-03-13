import { Button } from "@/components/ui/button"

type NewsFeeds = {
    id: string,
    status: string,
    sort: null,
    user_created: string,
    date_created: string,
    user_upadted: null,
    date_updated: null,
    title: string,
    description: string,
    content: string,
    tags: string[],
    image: string,
    time: string


}

export default function Card(props: NewsFeeds) {
    return <div className="flex flex-col gap-4 m-4t">
        <img src={props.image}></img>
        <div className="flex gap-4">
            <p>{props.title}</p>
            <p>{props.time}</p>
        </div>
        <p className="text-2xl font-bold">{props.description}</p>
        <p>{props.content}</p>
        <Button className="w-32 object-contain">Read More &nbsp; &gt;</Button>
    </div>
}