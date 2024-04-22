import { directusUrl } from "@/lib/constants"
import { News } from "@/lib/types"
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function NewsDetailed({ params: { slug } }: { params: { slug: string } }) {
    const fields = ["*", "categories.id", "categories.news_categories_id.*"].join(",")
    const { data: news } = await fetch(`${directusUrl}/items/news/${slug}?fields=${fields}`).then(res => res.json()) as { data: News & { categories: { id: number, news_categories_id: { id: number, name: string } }[] } }

    return news && <div className="container mx-auto flex flex-col gap-4" >
        <div className="flex flex-col gap-2">
            <p className="text-2xl"> {news.title} </p>
            <p className="text-subtext"> {news.description} </p>
        </div>
        <img src={`${directusUrl}/assets/${news.cover_image}`} alt="" />
        <div className="prose max-w-none">
            <MDXRemote options={{
                mdxOptions: {
                    format: "md"
                }
            }} source={news.content} />
        </div>
    </div >
}