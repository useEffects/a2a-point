"use client"

import { aggregate, readItems } from "@directus/sdk"
import { useSearchParams } from "next/navigation"
import { ListNews, MyPagination } from "src/components/client-components/news"
import { NewsLetter } from "src/components/news-letter"
import { News as NewsType } from "src/lib/types"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus"
import { useEffect } from "react"

export default function News() {
    const searchParams = useSearchParams()
    const page = searchParams.get("page")
    const limit = 3
    const offset = (parseInt(page ?? "1") - 1) * limit
    const fields = ["*", "categories.id", "categories.news_categories_id.*"]
    const { rest } = directusStore()

    const { data: news } = useQuery<NewsType[]>({
        queryKey: ["news", { fields, limit, offset }],
        queryFn: async () => await rest.request(readItems("news", { fields, limit, offset })) as NewsType[],
        initialData: [],
    })

    const { data: count } = useQuery<{ count: number }[]>({
        queryKey: ["news-count"],
        queryFn: async () => await rest.request(aggregate("news", { aggregate: { count: "*" } })) as { count: number }[],
    })

    const { data: categories } = useQuery<{ id: number, name: string }[]>({
        queryKey: ["news-categories"],
        queryFn: async () => await rest.request(readItems("news_categories")) as { id: number, name: string }[],
        initialData: []
    })

    useEffect(() => {
        if (!categories.some(n => n.id === 0)) {
            categories.unshift({ id: 0, name: "View All" })
        }
    }, [categories])

    return <div className="container mx-auto flex flex-col gap-40">
        <div className="flex flex-col gap-4 items-center">
            <p className="text-4xl font-semibold"> News and insights </p>
            <p className="max-w-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque, minima. Voluptates suscipit iste quo aliquid repudiandae! Aliquam dicta quas in.</p>
            {(news?.length && categories.length) && <ListNews news={news} categories={categories} />}
        </div>
        {count?.length &&
            <MyPagination totalPages={Math.ceil(count[0].count / limit)} activePage={parseInt(page ?? "1")} basePath="/news" />}
        <NewsLetter />
    </div>
}