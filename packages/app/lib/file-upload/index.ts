import { Asset, withUri } from "app/components/chat-ui"
import directusStore from "app/store/directus"
import * as FileSystem from "expo-file-system"
import { directusUrl } from "../constants"

export async function fileUpload(asset: Asset<withUri>, folderName: string): Promise<string> {
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
            folder: folderName
        }
    })
    return JSON.parse(res.body).data.id
}
