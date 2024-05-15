import { directusUrl } from "@/lib/constants";
import { Course } from "@/lib/types";
import StartButton from "@/components/client-components/course";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { NewsLetter } from "@/components/news-letter";

export default async function Courses() {
    const fields = ["id", "title", "description", "cover_image"]
    const { featured_course: featuredCourse } = await directus.request(readItems("portfolio", {
        fields: fields.map(field => `featured_course.${field}`)
    })) as unknown as { featured_course: Course }
    const courses = await directus.request(readItems("courses", {
        fields: fields,
        filter: {
            id: {
                _neq: featuredCourse?.id
            }
        }
    }))

    return <div className="container mx-auto flex flex-col gap-40">
        <div className="flex gap-4">
            <div className="w-1/2 h-full">
                <img src={`${directusUrl}/assets/${featuredCourse?.cover_image}`} className="rounded" alt="" />
            </div>
            <div className="w-1/2 p-4 flex flex-col gap-8 items-end">
                <p className="text-2xl"> {featuredCourse?.title} </p>
                <p className="max-w-md text-right"> {featuredCourse?.description} </p>
                <StartButton courseId={featuredCourse?.id!} />
            </div>
        </div>
        <div className="grid gap-4 grid-cols-3">
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