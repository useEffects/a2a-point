import { directusUrl } from "app/lib/constants"
import { publicToken } from "app/store/directus"

export const fetchAllData = async <R>(collection: string, filter: Record<string, any> = {}, fields: string[] = []) => {
    const promises: Promise<R[]>[] = []

    const systemCollections = ["users"]
    const finalCollection = systemCollections.includes(collection) ? collection : `items/${collection}`

    const totalItems = await fetch(`${directusUrl}/${finalCollection}/?aggregate[count]=*&fields=`, {
        headers: {
            Authorization: `Bearer ${publicToken}`
        }
    }).then(res => res.json()).then(res => {
        return res.data[0].count
    })

    const totalPages = Math.ceil(totalItems / 100)

    for (let i = 1; i <= totalPages; i++) {
        const res = fetch(`${directusUrl}/${finalCollection}/?filter=${JSON.stringify(filter)}&fields=${fields.join(",")}&page=${i}`, {
            headers: {
                Authorization: `Bearer ${publicToken}`
            }
        })
            .then(res => res.json())
            .then(res => res.data)
        promises.push(res)
    }

    return await Promise.all(promises).then(data => data.flat())
}