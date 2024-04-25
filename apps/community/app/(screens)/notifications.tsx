import { readNotifications } from "@directus/sdk";
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
  if(item.collection === "listings") {
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

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false)

  return <DropdownMenu open={open} onOpenChange={v => setOpen(!v)}>
    <DropdownMenuTrigger asChild>
      <Button className="w-8 h-8" size={"icon"} variant={"outline"} onPress={() => setOpen(p => !p)}>
        <Ionicons name="ellipsis-vertical-outline" size={14} className="!text-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <Text className="!text-sm">Mark as read</Text>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Text className="!text-sm">Delete Notification</Text>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Text className="!text-sm">Go to Chat</Text>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

const RenderNotifications = (item: Notification) => {
  const [imgSrc, setImgSrc] = useState<string>()
  useEffect(() => {
    getImageLink(item).then(setImgSrc)
  }, [])

  return imgSrc ? <View className={cn("gap-4", item.collection === "directus_users" ? "flex-col" : "flex-row")
  }>
    <Image className="w-8 h-8 rounded-full" source={{ uri: imgSrc }} />
    <View className="flex-col gap-2">
      <Text>{item.subject}</Text>
      <Text className="text-sm text-subtext">{item.message}</Text>
      <View className="ml-auto mr-0 flex-row items-center gap-2">
        <Text className="text-sm text-subtext">{shortTime(item.timestamp)}</Text>
        <NotificationDropdown />
      </View>
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

  return isLoading ? <></> : <FlatList contentContainerClassName="px-2 py-4"
    data={notifications}
    renderItem={({ item }) => <RenderNotifications {...item} />}
    ItemSeparatorComponent={() => <Separator className="my-2" />}
  />
}
