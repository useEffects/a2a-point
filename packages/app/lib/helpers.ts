import { aggregate, createItem, deleteItems, readItems } from "@directus/sdk";
import { Asset, withUri } from "app/components/chat-ui";
import directusStore from "app/store/directus";
import { queryClient } from "app/store/query";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker"
import TimeAgo from 'javascript-time-ago';
import en from "javascript-time-ago/locale/en";
import { Alert, Linking, Platform } from "react-native";
import { ProductType, appName, directusUrl, products } from "./constants";
import { Document } from "./types";
import { savesCountKey } from "./misc/queries";

TimeAgo.addLocale(en)

export const timeAgo = new TimeAgo('ar-AE')

export const buildAssetUrl = (id: string | null) => {
  if (!id) {
    return "https://a2apoint-misc.nyc3.digitaloceanspaces.com/app/no-image-available.png"
  }
  const { token } = directusStore.getState()
  return `${directusUrl}/assets/${id}?access_token=${token}`;
};

export const openUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url)
  if (supported) {
    await Linking.openURL(url)
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`)
  }
}

export type UserCount = { count: { directus_users_id: string } }

export const deleteBookmark = async (listingId: string, savedId: string) => {
  const { rest } = directusStore.getState()
  await queryClient.fetchQuery({
    queryKey: ["delete-listing", savedId],
    queryFn: async () => await rest.request(deleteItems("listings_directus_users", [savedId]))
  })
  queryClient.setQueryData(savesCountKey(listingId), ([prev]: UserCount[]
  ) => { return [{ count: { directus_users_id: (Number(prev!.count.directus_users_id) - 1).toString() } }] })
}

export const addBookmark = async (listingId: string, userId: string) => {
  const { rest } = directusStore.getState()
  const res = await queryClient.fetchQuery({
    queryKey: ["save-listing", listingId],
    queryFn: async () => await rest.request(createItem("listings_directus_users", {
      listings_id: listingId,
      directus_users_id: userId
    }))
  })
  queryClient.setQueryData(savesCountKey(listingId), ([prev]: UserCount[]
  ) => ([{ count: { directus_users_id: (Number(prev!.count.directus_users_id) + 1).toString() } }]))
  return res
}

export const getDMRoomId = async (
  [userId1, userId2]: [string, string],
) => {
  const { rest } = directusStore.getState()
  const rooms = await queryClient.fetchQuery({
    queryKey: ["Fetch Room", userId1, userId2],
    queryFn: async () => await rest.request(readItems("rooms", {
      filter: {
        type: {
          _eq: "dm"
        },
        _or: [
          {
            _and: [
              {
                user_created: {
                  id: {
                    _eq: userId1
                  }
                }
              },
              {
                members: {
                  directus_users_id: {
                    id: {
                      _eq: userId2
                    }
                  }
                }
              }
            ]
          },
          {
            _and: [
              {
                user_created: {
                  id: {
                    _eq: userId2
                  }
                }
              },
              {
                members: {
                  directus_users_id: {
                    id: {
                      _eq: userId1
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      fields: ["id"]
    }))
  })
  if (!rooms.length) {
    const room = await queryClient.fetchQuery({
      queryKey: ["Create Room"],
      queryFn: async () => await rest.request(createItem("rooms", {
        type: "dm",
        members: [
          {
            directus_users_id: userId1
          }, {
            directus_users_id: userId2
          }
        ]
      }, {
        fields: ["id"]
      }
      ))
    })
    return room.id as string
  } else {
    return rooms[0]!.id as string;
  }
};

export const searchBarContainerStyle = { backgroundColor: "transparent", flexGrow: 1, borderColor: "transparent" }
export const searchBarInputContainerStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderStyle: "solid" as "solid" | "dotted" | "dashed" | undefined,
  borderRadius: 9999,
  borderBottomWidth: 1,
  flexGrow: 1
}

export function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

export const shortString = (str: string | undefined | null, maxLength = 20) => {
  if (!str) return ""
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

export const getNewFileUrl = async (asset: Asset<withUri>) => {
  if (Platform.OS === "web") return asset.uri
  const uploadFolder = `${FileSystem.documentDirectory}/${appName}`
  const info = await FileSystem.getInfoAsync(uploadFolder)
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(uploadFolder, { intermediates: true })
  }
  const newUri = `${uploadFolder}/${asset.name}`
  await FileSystem.copyAsync({ from: asset.uri, to: newUri })
  return newUri
}

export const shortTime = (date_created: string) => (new Date(date_created)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

export const wordCount = (value: string | undefined) => {
  return value ? value.trim().split(/\s+/).length : 0;
};

export const checkCollectionId = async (id: string, collection: string): Promise<boolean> => {
  const { token } = directusStore.getState()
  try {
    const res = await fetch(`${directusUrl}/items/${collection}/${id}/?fields=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
    if (res.data && res.data.id) {
      return true
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

const pickDocumentsHelper = (assets: DocumentPicker.DocumentPickerAsset[] | ImagePicker.ImagePickerAsset[]) => {
  return assets.map(asset => {
    function isDocument(asset: DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset): asset is DocumentPicker.DocumentPickerAsset {
      return (asset as DocumentPicker.DocumentPickerAsset).name !== undefined
    }
    if (isDocument(asset)) {
      return {
        uri: asset.uri,
        mimeType: asset.mimeType ?? "application/octet-stream",
        name: asset.name
      }
    } else {
      return {
        uri: asset.uri,
        mimeType: asset.mimeType ?? "image/jpeg",
        name: asset.fileName ?? "image.jpg"
      }
    }
  }).filter(async asset => {
    const fileInfo = await FileSystem.getInfoAsync(asset.uri, { size: true }) as FileSystem.FileInfo & { size: number }
    if (fileInfo.size > 1 * 1024 * 1024) {
      alert(`File size exceeds 1MB limit for ${asset.name} (${fileInfo.size / 1000 / 1000}MB)`)
      return false
    }
    return true
  })
}

export const pickDocuments = async (params: DocumentPicker.DocumentPickerOptions): Promise<Asset<withUri>[]> => {
  const result = await DocumentPicker.getDocumentAsync(params)
  if (!result.canceled) {
    return pickDocumentsHelper([...result.assets])
  } else return []
}

export const pickImages = async (params: ImagePicker.ImagePickerOptions): Promise<Asset<withUri>[]> => {
  const result = await ImagePicker.launchImageLibraryAsync(params)
  if (!result.canceled) {
    return pickDocumentsHelper([...result.assets])
  }
  else return []
}

export const isUserPro = (plan: string | null | undefined) => {
  const product = products.find(p => p.productType === plan)
  switch (product?.productType) {
    case ProductType.proPlanMonthly:
    case ProductType.proPlanYearly:
    case ProductType.basicPlanMonthly:
    case ProductType.basicPlanYearly:
      return true
    default:
      return false
  }
}

export const isUserVerified = (document: Pick<Document, "verified">) => {
  return document.verified
}

// Utility type to derive dot-separated keys from a type T
export type DotSeparatedKeys<T> = T extends object
  ? T extends infer O
  ? {
    [K in keyof O]: O[K] extends object
    ? `${K & string}.${DotSeparatedKeys<O[K]>}`
    : `${K & string}`;
  }[keyof O]
  : never
  : never;

export function groupByN<T>(arr: T[], n: number = 2): T[][] {
  const grouped: T[][] = [];

  for (let i = 0; i < arr.length; i += n) {
    const group = arr.slice(i, i + n);
    grouped.push(group);
  }

  return grouped;
}
