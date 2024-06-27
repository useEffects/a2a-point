/** @jsxImportSource react */

import { Testimonial } from "@/components/client-components/home"
import { readItems } from "@directus/sdk"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import Home from "@/screens/home"

export default async function () {
    const { rest } = directusStore.getState()
    const testimonials = await queryClient.fetchQuery<Testimonial[]>({
        queryKey: ["testimonials"],
        queryFn: async () => await rest.request(readItems("portfolio", {
            fields: ["featured_testimonials.feedbacks_id.*", "featured_testimonials.feedbacks_id.user_created.avatar", "featured_testimonials.feedbacks_id.user_created.first_name", "featured_testimonials.feedbacks_id.user_created.last_name", "featured_testimonials.feedbacks_id.user_created.title"],
        })).then(data => (data as unknown as { featured_testimonials: { feedbacks_id: Testimonial }[] }).featured_testimonials.map(({ feedbacks_id }) => feedbacks_id))
    })
    return <Home testimonials={testimonials} />
}