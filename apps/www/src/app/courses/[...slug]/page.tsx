/**@jsxImportSource react */

import directusStore from "app/store/directus"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { Separator } from "src/components/ui/separator"
import { Course, CourseLesson } from "src/lib/types"
import { cn } from "src/lib/utils"
import { readItem } from "@directus/sdk"
import { queryClient } from "app/store/query"

const LessonsSidebar = ({ lessons, currentLessonId }: { lessons: CourseLesson[], currentLessonId: string }) => {
    return <div className="w-full flex flex-col">
        {lessons.map((lesson, i) => <div key={i} className={cn("flex flex-col p-2", currentLessonId === lesson.id ? "border-l-[2px] border-primary" : "border-l-[1px]")}>
            <Link href={lesson.id} className={cn("text-sm text-primary", currentLessonId !== lesson.id && "text-subtext")}>
                {lesson.name}
            </Link>
            {i !== lessons.length - 1 && <Separator />}
        </div>)}
    </div>
}

export default async function ({ params: { slug } }: { params: { slug: string[] } }) {

    const [courseId, lessonId] = slug
    const { rest } = directusStore.getState()

    const course = await queryClient.fetchQuery({
        queryKey: ["courses", courseId],
        queryFn: async () => await rest.request(readItem("courses", courseId, {
            fields: ["*", "course_lessons.*"]
        })) as Course & { course_lessons: CourseLesson[] }
    })

    if (course && !lessonId) {
        redirect(`/courses/${courseId}/${course.course_lessons[0].id}`)
    }

    const lesson = course.course_lessons.find(lesson => lesson.id === lessonId)

    return course && <div className="flex container mx-auto gap-4 p-4">
        <div className="w-1/4">
            <LessonsSidebar lessons={course.course_lessons} currentLessonId={lessonId} />
        </div>
        <div className="w-3/4">
            {course.course_lessons.length && <>
                <Separator className="my-4" />
                <p className="my-4"> Answer the quiz </p>
                <div className="flex flex-col gap-4">
                    {lesson?.lesson_quiz.map((quiz, i) => <div key={i}>
                        <p> {quiz.question} </p>
                        <div className="flex flex-col gap-2">
                            { }
                        </div>
                    </div>)}
                </div>
            </>}
        </div>
    </div>
}