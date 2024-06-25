import { NextResponse } from "next/server"
import levenshtein from "fast-levenshtein"
import iconVersion from "../../names.json"

export const GET = async (req: Request, { params }: { params: { query: string } }) => {
    const names = Object.keys(iconVersion)
    const filtered = names.filter(name => name.includes(params.query.trim().toLowerCase()))
        .sort((a, b) => levenshtein.get(params.query, a) - levenshtein.get(params.query, b))
        .slice(0, 5)
    return NextResponse.json(filtered.length ? filtered : names.slice(0, 5))
}