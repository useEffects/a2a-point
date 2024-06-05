import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = (req: NextApiRequest) => {
    if (!req.url) return NextResponse.json({ error: 'Could not find request url' }, { status: 400 });
    const reqUrl = new URL(req.url)

    const userId = reqUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId missing in search param' }, { status: 400 });

    

}