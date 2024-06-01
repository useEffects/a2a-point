"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "src/components/ui/pagination";
import { Separator } from "src/components/ui/separator";
import { Text } from "src/components/ui/text";
import { directusUrl } from "src/lib/constants";
import { News } from "src/lib/types";
import { cn } from "app/lib/utils";
import { timeAgo } from "app/lib/helpers";
import { useIsSmallDevice } from "@/hooks/is-small-device";

const NewsCard = ({ news, isFirst }: { news: News, isFirst?: boolean }) => {
    const router = useRouter()

    return <div className={cn("flex flex-col gap-4 h-full", isFirst ? "flex-row" : "max-w-sm")}>
        <img src={`${directusUrl}/assets/${news.cover_image}`} className={cn("object-cover rounded", isFirst ? "w-1/2" : "w-full h-[200px]")} alt="" />
        <div className={cn("flex flex-col gap-4 items-start grow", isFirst ? "w-1/2 grow p-12" : "w-full")}>
            <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                    {news.categories?.map((category, i) => <span className="rounded-full border px-2" key={i}>
                        {category.news_categories_id.name}
                    </span>)}
                    <p className="text-sm"> {news.read_time} </p>
                </div>
                <p className="text-sm"> {timeAgo.format(new Date(news.date_created))} </p>
            </div>
            <p className={cn(isFirst ? "text-xl font-semibold" : "text-lg")}> {news.title} </p>
            <p className="text-sm"> {news.description} </p>
            <Button className="mt-auto mb-0" onPress={() => router.push(`/news/${news.id}`)}>
                <Text>Read More</Text>
            </Button>
        </div>
    </div>
}

export function ListNews({ news, categories: _categories }: { news: News[], categories: { id: number, name: string }[] }) {
    const [currentCategory, setCurrentCategory] = useState(0)
    const filteredNews = currentCategory === 0 ? news : news.filter(n => n.categories?.find(c => c.news_categories_id.id === currentCategory))
    const isSmallDevice = useIsSmallDevice()
    const [categories] = useState([{ id: 0, name: "View All" }, ..._categories])

    if (!filteredNews.length) {
        console.log(news, categories)
        return null
    }

    const [first, ...rest] = filteredNews

    return <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between md:justify-center gap-4">
            {categories.map((category, i) => <Button
                variant={currentCategory === category.id ? "default" : "ghost"}
                key={i}
                onPress={() => setCurrentCategory(category.id)}>
                <Text>
                    {category.name}
                </Text>
            </Button>)}
        </div>
        <Separator className="w-full my-4 md:my-12" />
        <NewsCard news={first} isFirst={!isSmallDevice} />
        <Separator className="w-full my-4 md:my-12" />
        <div className="flex flex-col gap-4">
            <p className="text-xl font-medium">Latest</p>
            <div className="grid gap-4 md:grid-cols-3">
                {rest.map((news, i) => <NewsCard key={i} news={news} />)}
            </div>
        </div>
    </div>
}

export function MyPagination({ totalPages, activePage, basePath }: { totalPages: number, activePage: number, basePath: string }) {
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