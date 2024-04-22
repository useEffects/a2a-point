"use client"

import { News, NewsCategory } from "@/lib/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { directusUrl } from "@/lib/constants";
import { cn, shortDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const NewsCard = ({ news, isFirst }: { news: News, isFirst?: boolean }) => {
    const router = useRouter()

    return <div className={cn("flex flex-col gap-4 p-4", isFirst ? "flex-row" : "max-w-sm")}>
        <img src={`${directusUrl}/assets/${news.cover_image}`} className={cn("object-contain rounded border", isFirst ? "w-1/2" : "w-full")} alt="" />
        <div className={cn("flex flex-col gap-4 items-start", isFirst ? "w-1/2 grow p-12" : "w-full")}>
            <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                    {news.categories?.map((category, i) => <span className="rounded-full border px-2" key={i}>
                        {category.news_categories_id.name}
                    </span>)}
                    <p className="text-sm"> {news.read_time} </p>
                </div>
                <p className="text-sm"> {shortDate(news.date_created)} </p>
            </div>
            <p className={cn(isFirst ? "text-xl font-semibold" : "text-lg")}> {news.title} </p>
            <p className="text-sm"> {news.description} </p>
            <Button className="mt-auto mb-0" onClick={() => router.push(`/news/${news.id}`)}> Read More </Button>
        </div>
    </div>
}

export function ListNews({ news, categories }: { news: News[], categories: { id: number, name: string }[] }) {
    const [currentCategory, setCurrentCategory] = useState(0)
    const filteredNews = currentCategory === 0 ? news : news.filter(n => n.categories?.find(c => c.id === currentCategory))

    const first = filteredNews[0]
    const rest = filteredNews.slice(0)

    return <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4">
            {categories.map((category, i) => <Button
                variant={currentCategory === category.id ? "default" : "ghost"}
                key={i}
                onClick={() => setCurrentCategory(category.id)}>
                {category.name}
            </Button>)}
        </div>
        <NewsCard news={first} isFirst />
        <div>
            {rest.map((news, i) => <NewsCard key={i} news={news} />)}
        </div>
    </div>

}