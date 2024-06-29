import { Asset, withUri } from "app/components/chat-ui"
import directusStore from "app/store/directus"
import * as FileSystem from "expo-file-system"
import { directusUrl } from "../constants"

export async function uploadFileToDirectus(asset: Asset<withUri>, folderId: string): Promise<string> {
    const { token } = directusStore.getState()
    const fileInfo = await FileSystem.getInfoAsync(asset.uri)
    if (!fileInfo.exists) {
        throw new Error("File does not exist")
    }
    const res = await FileSystem.uploadAsync(`${directusUrl}/files`, asset.uri, {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        parameters: {
            folder: folderId,
            title: asset.name
        }
    })
    return JSON.parse(res.body).data.id
}

export async function getFileSize(asset: Asset<withUri>): Promise<number> {
    const fileInfo = await FileSystem.getInfoAsync(asset.uri, { size: true })
    if (!fileInfo.exists) {
        throw new Error("File does not exist")
    }
    return fileInfo.size
}
