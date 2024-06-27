/** @jsxImportSource react */

import { aggregate, readItems } from "@directus/sdk"
import { ListNews, MyPagination } from "src/components/client-components/news"
import { NewsLetter } from "src/components/news-letter"
import { News as NewsType } from "src/lib/types"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"

export default async function News({ searchParams }: { searchParams: { page?: string } }) {
    const { page = "1" } = searchParams
    const limit = 3
    const offset = (parseInt(page) - 1) * limit
    const fields = ["*", "categories.id", "categories.news_categories_id.*"]
    const { rest } = directusStore.getState()

    const news = await queryClient.fetchQuery<NewsType[]>({
        queryKey: ["news", { fields, limit, offset }],
        queryFn: async () => await rest.request(readItems("news", { fields, limit, offset })) as NewsType[],
        initialData: [],
    })

    const count = await queryClient.fetchQuery<{ count: number }[]>({
        queryKey: ["news-count"],
        queryFn: async () => await rest.request(aggregate("news", { aggregate: { count: "*" } })) as { count: number }[],
    })

    const categories = await queryClient.fetchQuery<{ id: number, name: string }[]>({
        queryKey: ["news-categories"],
        queryFn: async () => await rest.request(readItems("news_categories")) as { id: number, name: string }[],
        initialData: []
    })

    return <div className="container mx-auto flex flex-col gap-12 md:gap-40 p-4">
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