import { Button } from "@/components/ui/button"
import { directusUrl } from "@/lib/constants"

type NewsFeeds = {
    id: string,
    status: string,
    sort: null,
    user_created: string,
    date_created: string,
    user_upadted: null,
    date_updated: null,
    title: string,
    content: string,
    category: string,
    image: string,
    time: string


}

export default function Card(props: NewsFeeds) {
    return <div className="flex flex-col gap-4 m-4">
        <img src={`${directusUrl}/assets/${props.image}`} className="w-full object-contain"></img>
        <div className="flex gap-4">
            <Button>{props.category}</Button>
            <p className="p-2">{props.time}</p>
        </div>
        <p className="text-2xl font-bold ">{props.title}</p>
        <p>{props.content}</p>
        <Button className="w-32 object-contain">Read More &nbsp; &gt;</Button>
    </div >
}