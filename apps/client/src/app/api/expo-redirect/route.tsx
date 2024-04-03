import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = cookies().get("directus_session_token")?.value
    const appUrl = req.nextUrl.searchParams.get("appUrl")
    return new NextResponse(`
        <!DOCTYPE html>
        <html>
            <body>
                <script>
                    window.location.replace("${appUrl}?access_token=${token}")
                </script>
            </body>
        </html>
    `, {
        headers: {
            "content-type": "text/html"
        }
    })
}