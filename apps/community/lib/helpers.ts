import { aggregate, createItem, deleteItems, readItems } from "@directus/sdk";
import { Alert, Linking, Platform } from "react-native";
import { ListingCardMetrics } from "~/components/listings-cards/molecules/full";
import directusStore from "~/store/directus";
import { queryClient } from "..";
import { directusUrl } from "./constants";

export const buildAssetUrl = (id: string | null) => {
  if (null) {
    return "https://dev.a2apoint.com"
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

export const viewsCountKey = (listingId: string) => ["views-count", listingId]
export const savesCountKey = (listingId: string) => ["saves-count", listingId]

export type UserCount = { count: { directus_users_id: string } }

export const getListingMetrics = async (listingId: string): Promise<ListingCardMetrics> => {
  const { rest } = directusStore.getState()
  const [viewsRes] = await queryClient.fetchQuery({
    queryKey: viewsCountKey(listingId),
    queryFn: async () => await rest.request(aggregate("listings_directus_users_1", {
      aggregate: {
        count: ["directus_users_id"],
      },
      query: {
        filter: {
          listings_id: {
            _eq: listingId
          }
        }
      }
    }))
  })
  const [savesRes] = await queryClient.fetchQuery({
    queryKey: savesCountKey(listingId),
    queryFn: async () => await rest.request(aggregate("listings_directus_users", {
      aggregate: {
        count: ["directus_users_id"],
      },
      query: {
        filter: {
          listings_id: {
            _eq: listingId
          }
        }
      }
    }))
  })
  return {
    views: viewsRes.count["directus_users_id"],
    saves: savesRes.count["directus_users_id"],
  }
}

export const deleteBookmark = async (listingId: string, savedId: string) => {
  const { rest } = directusStore.getState()
  await queryClient.fetchQuery({
    queryKey: ["delete-listing", savedId],
    queryFn: async () => await rest.request(deleteItems("listings_directus_users", [savedId]))
  })
  queryClient.setQueryData(savesCountKey(listingId), ([prev]: UserCount[]
  ) => { return { count: { directus_users_id: (Number(prev.count.directus_users_id) - 1).toString() } } })
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
  ) => ({ count: { directus_users_id: (Number(prev.count.directus_users_id) + 1).toString() } }))
  return res
}

export const getDMRoomId = async (
  [userId1, userId2]: [string, string],
) => {
  const { rest } = directusStore.getState()
  const rooms = await queryClient.fetchQuery({
    queryKey: ["Fetch Room"],
    queryFn: async () => await rest.request(readItems("rooms", {
      filter: {
        type: {
          _eq: "Group"
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
        type: "Group",
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
    return rooms[0].id as string;
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