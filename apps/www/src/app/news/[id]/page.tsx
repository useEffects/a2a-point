/** @jsxImportSource react */

import { readItem } from '@directus/sdk'
import { directusUrl } from "app/lib/constants"
import directusStore from 'app/store/directus'
import { queryClient } from 'app/store/query'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { News } from "src/lib/types"

export default async function ({ params }: { params: { id: string } }) {
    const { id } = params
    const { rest } = directusStore.getState()

    const news = await queryClient.fetchQuery<News>({
        queryKey: ["news", id],
        queryFn: async () => await rest.request(readItem("news", id, {
            fields: ["*", "categories.id", "categories.news_categories_id.*"]
        })) as News,
    })

    return <div className="max-w-xl mx-4 md:mx-auto flex flex-col gap-4 md:gap-12" >
        <div className="flex flex-col gap-2">
            <p className="text-2xl"> {news.title} </p>
            <p className="text-subtext"> {news.description} </p>
            <p className='text-sm'>{news.tags.join(", ")}</p>
        </div>
        <img src={`${directusUrl}/assets/${news.cover_image}`} alt="" />
        <div className="prose max-w-none">
            {/* <MDXRemote options={{
                mdxOptions: {
                    format: "md",
                    development: true
                }
            }} source={news.content} /> */}
        </div>
    </div>
}