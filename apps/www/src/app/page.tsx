"use client"

import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"

export default function Page() {
    return <div>
        <h1>Page</h1>
        <p>This is a page.</p>
        <Button variant={"default"}><Text>Foobar</Text></Button>
    </div>
}