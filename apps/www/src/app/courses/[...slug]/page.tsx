"use client"

import directusStore from "app/store/directus"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Separator } from "src/components/ui/separator"
import { Course, CourseLesson } from "src/lib/types"
import { cn } from "src/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { readItem } from "@directus/sdk"

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

export default function CourseStart({ params: { slug } }: { params: { slug: string[] } }) {

    const [courseId, lessonId] = slug
    const fields = ["*.*.*"]
    const { rest } = directusStore()
    const [lesson, setLesson] = useState<CourseLesson>()
    const router = useRouter()

    const { data: course } = useQuery<Course>({
        queryKey: ["courses", courseId],
        queryFn: async () => await rest.request(readItem("courses", courseId, {
            fields
        })) as Course
    })

    useEffect(() => {
        if (course) {
            if (!lessonId) {
                router.push(`/courses/${courseId}/${course.course_lessons[0].id}`)
            } else {
                const lesson = course.course_lessons.find(lesson => lesson.id === lessonId)
                setLesson(lesson)
            }
        }
    }, [course, lesson])

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