import { directusUrl } from "app/lib/constants";
import { portfolioUrl } from "app/lib/constants";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    console.log(cookies().getAll())
    const token = cookies().get("directus_session_token")?.value
    const appUrl = req.nextUrl.searchParams.get("appUrl")
    console.log(token)
    if (token) {
        const decoded = jwtDecode<JWTTokenPayload>(token)
        const { session } = decoded
        const data = await fetch(`${directusUrl}/auth/refresh`, {
            method: "POST",
            body: JSON.stringify({
                mode: "json",
                refresh_token: session
            }),
            cache: "no-cache",
            headers: {
                "content-type": "application/json"
            }
        }).then(res => res.json())

        const { access_token, refresh_token } = data.data

        const url = new URL(appUrl!)
        url.searchParams.append("access_token", access_token)
        url.searchParams.append("refresh_token", refresh_token)

        const script = url.origin === (new URL(portfolioUrl).origin) ?
            `window.opener.postMessage({ accessToken: "${access_token}", refreshToken: "${refresh_token}" }, window.location.origin);` :
            `window.location.replace("${url.toString()}")`

        return new NextResponse(`
        <!DOCTYPE html>
        <html>
            <body>
            <script>
                ${script}
            </script>
        </body>
        </html>
        `, {
            headers: {
                "content-type": "text/html"
            }
        })
    }
    else return new NextResponse("Bad request", { status: 400 })
}

type JWTTokenPayload = {
    id: string;
    role: string;
    app_access: number;
    admin_access: number;
    session: string;
    iat: number;
    exp: number;
    iss: string;
}
