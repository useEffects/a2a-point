import { Separator } from "@/components/ui/separator"
import { directusUrl, nextUrl } from "@/lib/constants"
import { Course, CourseLesson } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Divide } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const LessonsSidebar = ({ lessons, currentLessonId }: { lessons: CourseLesson[], currentLessonId: string }) => {
    console.log(lessons)
    return <div className="w-full flex flex-col">
        {lessons.map((lesson, i) => <div key={i} className={cn("flex flex-col p-2", currentLessonId === lesson.id ? "border-l-[2px] border-primary" : "border-l-[1px]")}>
            <Link href={lesson.id} className={cn("text-sm text-primary", currentLessonId !== lesson.id && "text-subtext")}>
                {lesson.name}
            </Link>
            {i !== lessons.length - 1 && <Separator />}
        </div>)}
    </div>
}

export default async function CourseStart({ params: { slug } }: { params: { slug: string[] } }) {

    const [courseId, lessonId] = slug
    const { data: course } = await fetch(`${directusUrl}/items/courses/${courseId}/?fields=*.*.*`).then(res => res.json()) as { data: Course }

    if (!lessonId) {
        redirect(`/courses/${courseId}/${course.course_lessons[0].id}`)
    }
    const lesson = course.course_lessons.find(lesson => lesson.id === lessonId)

    return <div className="flex container mx-auto gap-4 p-4">
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