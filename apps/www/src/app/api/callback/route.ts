import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { nextUrl } from "src/lib/constants";

export async function GET(req: NextRequest) {
    const token = cookies().get("directus_session_token")?.value
    const appUrl = req.nextUrl.searchParams.get("appUrl") || `${nextUrl}/redirecting`
    if (appUrl && token) {
        const url = new URL(appUrl!)
        url.searchParams.append("access_token", token!)
        return new NextResponse(`
        <!DOCTYPE html>
        <html>
            <body>
            <script>
                window.location.replace("${url.toString()}")
            </script>
        </body>
        </html>
        `, {
            headers: {
                "content-type": "text/html"
            }
        })
    }
}