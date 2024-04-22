import { ListNews } from "@/components/news/list"
import { Button } from "@/components/ui/button"
import { directusUrl } from "@/lib/constants"
import { News, NewsCategory } from "@/lib/types"

export default async function News() {
    const fields = ["*", "categories.id", "categories.news_categories_id.*"].join(",")
    const { data: news } = await fetch(`${directusUrl}/items/news?fields=${fields}`).then(res => res.json()) as { data: News[] }
    const { data: categories } = await fetch(`${directusUrl}/items/news_categories`).then(res => res.json()) as { data: { id: number, name: string }[] }

    const first = news[0]
    const rest = news.slice(1)

    categories.unshift({ id: 0, name: "View All" })

    return <div className="container mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4 items-center">
            <p className="text-2xl"> News and insights </p>
            <p className="max-w-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque, minima. Voluptates suscipit iste quo aliquid repudiandae! Aliquam dicta quas in.</p>
        </div>
        <ListNews news={news} categories={categories} />
    </div>
}