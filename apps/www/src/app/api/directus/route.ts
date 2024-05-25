import { Query, createItem, readItem, readItems } from "@directus/sdk";
import { directus } from "src/lib/directus";

export const getItems = async (collection: string, query?: Query<any, any>) => {
    return await directus.request(readItems(collection, query));
}

export const getItem = async (collection: string, id: number | string, query?: Query<any, any>) => {
    return await directus.request(readItem(collection, id, query));
}

export const postItems = async (collection: string, payload: any, query?: Query<any, any>) => {
    return await directus.request(createItem(collection, payload, query));
}

export const POST = async (req: Request): Promise<Response> => {
    try {
        const body = await req.json();
        const { collection, query, payload, id } = body as { collection: string, query?: Query<any, any>, payload: any, id: number };

        if (!collection) {
            return new Response("Collection is required", { status: 400 });
        }

        if (id) {
            const item = await getItem(collection, id, query);
            return new Response(JSON.stringify(item), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if (!payload) {
            const items = await getItems(collection, query);
            return new Response(JSON.stringify(items), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const newItem = await postItems(collection, payload, query);
        return new Response(JSON.stringify(newItem), { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
