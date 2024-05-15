import { News } from "@/lib/types"
import { getItems } from "../api/directus/route"
import { ListNews, MyPagination } from "@/components/client-components/news"
import { directus } from "@/lib/directus"
import { aggregate, readItems } from "@directus/sdk"
import { NewsLetter } from "@/components/news-letter"

export default async function News({ searchParams: { page } }: { searchParams: { page: string } }) {
    const limit = 3
    const offset = (parseInt(page ?? "1") - 1) * limit
    const fields = ["*", "categories.id", "categories.news_categories_id.*"]
    const news = await directus.request(readItems("news", { fields, limit, offset })) as News[]
    const [count] = await directus.request(aggregate("news", { aggregate: { count: "*" } })) as { count: number }[]

    const categories = await directus.request(readItems("news_categories")) as { id: number, name: string }[]

    categories.unshift({ id: 0, name: "View All" })

    return <div className="container mx-auto flex flex-col gap-40">
        <div className="flex flex-col gap-4 items-center">
            <p className="text-4xl font-semibold"> News and insights </p>
            <p className="max-w-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque, minima. Voluptates suscipit iste quo aliquid repudiandae! Aliquam dicta quas in.</p>
            <ListNews news={news} categories={categories} />
        </div>
        <MyPagination totalPages={Math.ceil(count.count / limit)} activePage={parseInt(page ?? "1")} basePath="/news" />
        <NewsLetter />
    </div>
}