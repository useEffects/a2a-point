export const PATCH = async (req: Request) => {
    const body = await req.json() as { userId: string, BRN: string, document: string }
}