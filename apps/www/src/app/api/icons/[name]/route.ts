import { portfolioUrl } from "app/lib/constants";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { name: string } }) => {
    try {
        const { name } = params;
        const icon = await import(`@material-symbols/svg-400/outlined/${name}.svg`)
        return NextResponse.redirect(portfolioUrl + icon.default.src, { status: 307 })
    } catch (error) {
    }
}