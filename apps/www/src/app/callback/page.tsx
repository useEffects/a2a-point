"use client"

import { useSearchParams } from "next/navigation";

export default function CallbackPage() {
    const params = useSearchParams()
    const session_id = params.get('session_id')
    console.log(session_id)
    return (
        <div>
            <h1>Callback Page</h1>
        </div>
    );
}