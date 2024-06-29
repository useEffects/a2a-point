import { uploadFiles } from "@directus/sdk";
import { Asset, withUri } from "app/components/chat-ui";
import directusStore from "app/store/directus";

export async function uploadFileToDirectus(asset: Asset<withUri>, folderName: string): Promise<string> {
    const { rest } = directusStore.getState()

    const file = await fetch(asset.uri)
    const blob = await file.blob()

    const formData = new FormData()
    formData.append("folder", folderName)
    formData.append("title", asset.name)
    formData.append("file", blob)
    const res = await rest.request(uploadFiles(formData))

    return res.id
}

export async function getFileSize(asset: Asset<withUri>): Promise<number> {
    const file = await fetch(asset.uri)
    const blob = await file.blob()
    return blob.size
}