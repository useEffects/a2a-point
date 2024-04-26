export type Course = {
    id: string;
    status: string;
    sort: null;
    date_created: string;
    date_updated: string | null;
    title: string;
    description: string;
    tags: string[];
    cover_image: string;
    course_lessons: CourseLesson[];
}

export type CourseLesson = {
    id: string;
    status: string;
    sort: null;
    date_created: string;
    date_updated: string | null;
    title: string;
    description: string;
    name: string;
    content: string;
    course: CourseRef;
    lesson_quiz: CourseQuiz[];
}

export type CourseQuiz = {
    id: number;
    options: string[];
    answers: string[];
    course_lesson: string;
    question: string;
}

export type CourseRef = {
    id: string;
    status: string;
    sort: null;
    user_created: string;
    date_created: string;
    user_updated: string | null;
    date_updated: string | null;
    title: string;
    description: string;
    cover_image: string;
    tags: string[];
    course_lessons: string[];
}

export type News = {
    id: string;
    status: string;
    user_created: string;
    date_created: string;
    user_updated: string;
    date_updated: string;
    title: string;
    description: string;
    tags: string[];
    content: string;
    cover_image: string;
    categories?: NewsCategory[];
    read_time: string
}

export type NewsCategory = {
    id: number;
    news_categories_id: {
        id: number;
        name: string;
    };
}

export type Feedback = {
    id: number;
    user_created: string;
    date_created: string;
    user_updated: string | null;
    date_updated: string | null;
    rating: number;
    content: string;
    agent: string;
}