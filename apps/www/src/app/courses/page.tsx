/** @jsxImportSource react */

import { readItems } from "@directus/sdk";
import directusStore from "app/store/directus";
import StartButton from "src/components/client-components/course";
import { NewsLetter } from "src/components/news-letter";
import { directusUrl } from "app/lib/constants";
import { Course } from "src/lib/types";
import { queryClient } from "app/store/query";

export default async function () {
    const fields = ["id", "title", "description", "cover_image"]
    const { rest } = directusStore.getState()

    const portfolio = await queryClient.fetchQuery<{ featured_course: Course }>({
        queryKey: ["featured-course", { fields }],
        queryFn: async () => await rest.request(readItems("portfolio", {
            fields: fields.map(field => `featured_course.${field}`)
        })) as unknown as { featured_course: Course },
    })

    const courses = await queryClient.fetchQuery<Course[]>({
        queryKey: ["courses", { fields }],
        queryFn: async () => await rest.request(readItems("courses", {
            fields,
            filter: {
                id: {
                    _neq: portfolio?.featured_course.id
                }
            }
        })) as Course[],
    })

    if (!portfolio || !courses) return null

    const { featured_course: featuredCourse } = portfolio

    return <div className="container mx-auto flex flex-col gap-12 md:gap-40 p-0">
        <div className="flex gap-4 flex-col md:flex-row p-4">
            <div className="md:w-1/2 h-full">
                <img src={`${directusUrl}/assets/${featuredCourse?.cover_image}`} className="rounded" alt="" />
            </div>
            <div className="md:w-1/2 p-4 flex flex-col gap-4 md:gap-8 md:items-end">
                <p className="text-2xl font-bold text-primary"> {featuredCourse?.title} </p>
                <p className="max-w-md md:text-right"> {featuredCourse?.description} </p>
                <StartButton courseId={featuredCourse?.id!} />
            </div>
        </div>
        <div className="grid gap-8 md:gap-4 grid-cols-1 md:grid-cols-3 p-4">
            {courses.map(course => <div key={course.id} className="flex flex-col gap-4 h-full">
                <img src={`${directusUrl}/assets/${course.cover_image}`} className="rounded w-full h-[200px] object-cover" alt="" />
                <p className="text-2xl"> {course.title} </p>
                <p className=""> {course.description} </p>
                <StartButton className="mt-auto mb-0" courseId={course.id} />
            </div>)}
        </div>
        <NewsLetter />
    </div >
}