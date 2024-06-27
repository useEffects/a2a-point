"use client"

import { MDXRemote } from 'next-mdx-remote/rsc'
import { directusUrl } from "app/lib/constants"
import { useQuery } from "@tanstack/react-query"
import { News } from "src/lib/types"
import directusStore from 'app/store/directus'
import { readItem } from '@directus/sdk'
import { useParams } from 'next/navigation'

export default function NewsDetailed() {
    const params = useParams()
    const slug = params.slug as string
    const fields = ["*", "categories.id", "categories.news_categories_id.*"]
    const { rest } = directusStore()
    const { data: news } = useQuery<News>({
        queryKey: ["news", slug, { fields }],
        queryFn: async () => await rest.request(readItem("news", slug, { fields })) as News,
    })

    console.log({ news })

    return news && <div className="max-w-xl mx-4 md:mx-auto flex flex-col gap-4 md:gap-12" >
        <div className="flex flex-col gap-2">
            <p className="text-2xl"> {news.title} </p>
            <p className="text-subtext"> {news.description} </p>
            <p className='text-sm'>{news.tags.join(", ")}</p>
        </div>
        <img src={`${directusUrl}/assets/${news.cover_image}`} alt="" />
        <div className="prose max-w-none">
            <MDXRemote options={{
                mdxOptions: {
                    format: "md",
                    development: true
                }
            }} source={news.content} />
        </div>
    </div >
}