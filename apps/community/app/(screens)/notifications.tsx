import { deleteNotification, readNotifications, updateNotification } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { queryClient } from "~/index";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl, shortTime } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import directusStore from "~/store/directus";
import { Notification } from "~/types";
import { Ionicons } from "@expo/vector-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { useColorScheme } from "~/lib/useColorScheme";


const getImageLink = async (item: Notification) => {
  const { token } = directusStore.getState()
  if (item.collection === "directus_users") {
    const data = await queryClient.fetchQuery({
      queryKey: ["Fetch user avatar by id", item.id, item.item],
      queryFn: async () => await fetch(`${directusUrl}/users/${item.item}/?fields=avatar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json()).then(res => res.data.avatar)
    })
    return buildAssetUrl(data)
  }
  if (item.collection === "listings") {
    const data = await queryClient.fetchQuery({
      queryKey: ["Fetch listing image by id", item.id, item.item],
      queryFn: async () => await fetch(`${directusUrl}/listings/${item.item}/?fields=images`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.json()).then(res => res.data.images[0])
    })
    return buildAssetUrl(data)
  }
}

const NotificationDropdown = ({ notification }: { notification: Notification }) => {
  const [open, setOpen] = useState(false)
  const { rest } = directusStore()

  const handleUpdate = async () => {
    await queryClient.fetchQuery({
      queryKey: ["Update Notification", notification.id],
      queryFn: async () => await rest.request(updateNotification(notification.id.toString(), {
        status: "archived"
      }))
    })
    setOpen(false)
  }

  const handleDelete = async () => {
    await queryClient.fetchQuery({
      queryKey: ["Delete Notification", notification.id],
      queryFn: async () => await rest.request(deleteNotification(notification.id.toString()))
    })
    setOpen(false)
  }

  return <DropdownMenu open={open} onOpenChange={v => setOpen(v)}>
    <DropdownMenuTrigger asChild>
      <Button className="w-8 h-8" size={"icon"} variant={"outline"} onPress={() => setOpen(p => !p)}>
        <Ionicons name="ellipsis-vertical-outline" size={14} className="!text-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <Text onPress={handleUpdate} className="!text-sm">Mark as read</Text>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Text onPress={handleDelete} className="!text-sm">Delete Notification</Text>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Text className="!text-sm">Go to Chat</Text>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

const RenderNotifications = (notification: Notification) => {
  const [imgSrc, setImgSrc] = useState<string>()
  const { colors } = useColorScheme()

  useEffect(() => {
    getImageLink(notification).then(setImgSrc)
  }, [])

  let borderLeftColor
  if (notification.collection === "directus_users") borderLeftColor = colors.info
  if (notification.collection === "listings") borderLeftColor = colors.success


  return imgSrc ? <View style={{ borderLeftWidth: 6, borderLeftColor }} className={cn("gap-1 p-2 border-solid border-0", notification.collection === "directus_users" ? "flex-col" : "flex-row")
  }>
    <View className="flex-row">
      <Image className="w-8 h-8 rounded-full" source={{ uri: imgSrc }} />
      <View className="ml-auto mr-0 flex-row items-center gap-2">
        <Text className="text-sm text-subtext">{shortTime(notification.timestamp)}</Text>
        <NotificationDropdown notification={notification} />
      </View>
    </View>
    <View className="flex-col">
      <Text>{notification.subject}</Text>
      <Text className="text-sm text-subtext">{notification.message}</Text>
    </View>
  </View> : <></>
}

export default function Community() {
  const { rest } = directusStore()
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["Fetching Notifications"],
    queryFn: async () => await rest.request(readNotifications({
      filter: {
        status: {
          _eq: "inbox"
        }
      }
    })),
    initialData: []
  }) as { data: Notification[], isLoading: boolean }

  return isLoading ? <></> : <FlatList
    data={notifications}
    renderItem={({ item }) => <RenderNotifications {...item} />}
    ItemSeparatorComponent={() => <Separator />}
  />
}
