"use client"

import { News } from "@/lib/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { directusUrl } from "@/lib/constants";
import { cn, shortDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const NewsCard = ({ news, isFirst }: { news: News, isFirst?: boolean }) => {
    const router = useRouter()

    return <div className={cn("flex flex-col gap-4 p-4 h-full", isFirst ? "flex-row" : "max-w-sm")}>
        <img src={`${directusUrl}/assets/${news.cover_image}`} className={cn("object-cover rounded", isFirst ? "w-1/2" : "w-full h-[200px]")} alt="" />
        <div className={cn("flex flex-col gap-4 items-start grow", isFirst ? "w-1/2 grow p-12" : "w-full")}>
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

    return <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-center gap-4">
            {categories.map((category, i) => <Button
                variant={currentCategory === category.id ? "default" : "ghost"}
                key={i}
                onClick={() => setCurrentCategory(category.id)}>
                {category.name}
            </Button>)}
        </div>
        <Separator className="w-full my-12" />
        <NewsCard news={first} isFirst />
        <Separator className="w-full my-12" />
        <div className="grid gap-4 grid-cols-3">
            {rest.map((news, i) => <NewsCard key={i} news={news} />)}
        </div>
    </div>
}

export function MyPagination({ totalPages, activePage, basePath }: { totalPages: number, activePage: number, basePath: string }) {
    console.log(typeof activePage)
    return <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href={activePage !== 1 ? `${basePath}/?page=${activePage - 1}` : undefined} />
            </PaginationItem>
            {Array(totalPages).fill(null).map((_, i) => <PaginationItem key={i}>
                <PaginationLink isActive={i + 1 === activePage} href={`${basePath}/?page=${i + 1}`}>
                    {i + 1}
                </PaginationLink>
            </PaginationItem>)}
            <PaginationNext href={activePage !== totalPages ? `${basePath}/?page=${activePage + 1}` : undefined} />
        </PaginationContent>
    </Pagination>
}