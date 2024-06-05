"use client"

import PostScreenComponent from "app/screens/post"

export default function PostPage() {
    return <div className="flex flex-col gap-12">
        <p className="text-3xl font-bold">Post a new <span className="text-primary">listing</span></p>
        <PostScreenComponent />
    </div>
}