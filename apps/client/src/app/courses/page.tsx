import { directusUrl } from "@/lib/constants";
import { Course } from "@/lib/types";
import StartButton from "@/components/courses/start-button";

export default async function Courses() {
    const fields = ["id", "title", "description", "cover_image"].join(",")
    const { data: courses } = await fetch(`${directusUrl}/items/courses/?fields=${fields}`).then(res => res.json()) as { data: Course[] }
    const a2apointCourse = courses.find(course => course.title === "A2APoint Course")
    const rest = courses.filter(course => course.title !== "A2APoint Course")

    return <div className="container mx-auto flex flex-col gap-4">
        <div className="flex gap-4">
            <div className="w-1/2 h-full">
                <img src={`${directusUrl}/assets/${a2apointCourse?.cover_image}`} className="rounded" alt="" />
            </div>
            <div className="w-1/2 p-4 flex flex-col gap-8 items-end">
                <p className="text-2xl"> {a2apointCourse?.title} </p>
                <p className="max-w-md text-right"> {a2apointCourse?.description} </p>
                <StartButton courseId={a2apointCourse?.id!} />
            </div>
        </div>
        <div className="grid gap-4 grid-cols-3">
            {rest.map(course => <div key={course.id} className="flex flex-col gap-4">
                <img src={`${directusUrl}/assets/${course.cover_image}`} className="rounded" alt="" />
                <p className="text-2xl"> {course.title} </p>
                <p className=""> {course.description} </p>
                <StartButton courseId={course.id} />
            </div>)}
        </div>
    </div >

}