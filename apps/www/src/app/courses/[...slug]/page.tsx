/**@jsxImportSource react */

import directusStore from "app/store/directus"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { Separator } from "src/components/ui/separator"
import { Course, CourseLesson } from "src/lib/types"
import { cn } from "src/lib/utils"
import { readItem } from "@directus/sdk"
import { queryClient } from "app/store/query"
import { MDXRemote } from "next-mdx-remote/rsc"

const LessonsSidebar = ({ lessons, currentLessonId }: { lessons: CourseLesson[], currentLessonId: string }) => {
    return <div className="w-full flex flex-col">
        {lessons.map((lesson, i) => <div key={i} className={cn("flex flex-col p-2", currentLessonId === lesson.id ? "border-l-[2px] border-primary" : "border-l-[1px]")}>
            <Link href={lesson.id} className={cn("text-sm text-primary", currentLessonId !== lesson.id && "text-subtext")}>
                {lesson.title}
            </Link>
            {i !== lessons.length - 1 && <Separator />}
        </div>)}
    </div>
}

export default async function CoursePage({ params: { slug } }: { params: { slug: string[] } }) {

    const [courseId, lessonId] = slug
    const { rest } = directusStore.getState()

    const course = await queryClient.fetchQuery({
        queryKey: ["courses", courseId],
        queryFn: async () => await rest.request(readItem("courses", courseId, {
            fields: ["*", "course_lessons.*", "course_lessons.course_quiz.*"]
        })) as Course & { course_lessons: CourseLesson[] }
    })

    if (course && !lessonId) {
        redirect(`/courses/${courseId}/${course.course_lessons[0]?.id}`)
    }

    const lesson = course.course_lessons.find(lesson => lesson.id === lessonId)!

    console.log("here", lesson.course_quiz)

    return course && <div className="flex flex-col container mx-auto gap-12 p-4">
        <p className="text-3xl md:text-5xl font-bold text-primary">{course.title}</p>
        <div className="flex gap-4">
            <div className="w-1/4">
                <LessonsSidebar lessons={course.course_lessons} currentLessonId={lessonId} />
            </div>
            <div className="w-3/4 flex flex-col gap-8">
                {course.course_lessons.length && <>
                    <p className="text-xl md:text-3xl font-bold text-primary">{lesson.title}</p>
                    <div className="prose max-w-none">
                        <MDXRemote source={lesson.content} />
                    </div>
                    <Separator />
                    <p className=""> Answer the quiz </p>
                    <div className="flex flex-col gap-4">
                        {lesson?.course_quiz.map((quiz, i) => <div key={i}>
                            <p> {quiz.question} </p>
                            <div className="flex flex-col gap-2">
                                { }
                            </div>
                        </div>)}
                    </div>
                </>}
            </div>
        </div>
    </div>
}