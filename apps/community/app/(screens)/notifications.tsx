import { deleteNotification, readNotifications, updateNotification } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { queryClient } from "~/index";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl, getDMRoomId, shortTime } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import directusStore from "~/store/directus";
import { Notification } from "~/types";
import { Ionicons } from "@expo/vector-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { useColorScheme } from "~/lib/useColorScheme";
import { useUserDetails } from "~/hooks/user-details";
import { UserChip } from "~/components/user-chip";
import { router, useNavigation } from "expo-router";
import { Header } from "~/components/header";

const fetchNotificationsQueryKey = ["Fetching Notifications"]

const NotificationDropdown = (props: Notification & { setNotifications: Dispatch<SetStateAction<Notification[]>> }) => {
  const [open, setOpen] = useState(false)
  const { rest } = directusStore()

  const handleUpdate = async () => {
    await queryClient.fetchQuery({
      queryKey: ["Update Notification", props.id],
      queryFn: async () => await rest.request(updateNotification(props.id.toString(), {
        status: "archived"
      }))
    })
    props.setNotifications(notifications => notifications.filter(n => n.id !== props.id))
    queryClient.setQueryData(fetchNotificationsQueryKey, (notifications: Notification[]) => notifications.filter(n => n.id !== props.id))
    setOpen(false)
  }

  const handleDelete = async () => {
    await queryClient.fetchQuery({
      queryKey: ["Delete Notification", props.id],
      queryFn: async () => await rest.request(deleteNotification(props.id.toString()))
    })
    props.setNotifications(notifications => notifications.filter(n => n.id !== props.id))
    queryClient.setQueryData(fetchNotificationsQueryKey, (notifications: Notification[]) => notifications.filter(n => n.id !== props.id))
    setOpen(false)
  }

  const handleChat = async () => {
    const roomId = await getDMRoomId([props.sender, props.recipient])
    router.push(`/chat/${roomId}`)
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
      <DropdownMenuItem onPress={handleChat}>
        <Text className="!text-sm">Go to Chat</Text>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

const RenderNotifications = (props: Notification & { setNotifications: Dispatch<SetStateAction<Notification[]>> }) => {
  const { colors } = useColorScheme()
  const senderDetails = useUserDetails(props.sender)

  let borderLeftColor
  if (props.collection === "directus_users") borderLeftColor = colors.info
  if (props.collection === "listings") borderLeftColor = colors.success

  return <View style={{ borderLeftWidth: 2, borderLeftColor }} className="gap-1 p-2 border-solid border-0 flex-col">
    <View className="flex-row justify-between items-center">
      {senderDetails ? <UserChip user={senderDetails} /> : <View />}
      <View className="flex-row items-center gap-2">
        <Text className="text-sm text-subtext">{shortTime(props.timestamp)}</Text>
        <NotificationDropdown {...props} />
      </View>
    </View>
    <View className="flex-col">
      <Text>{props.subject}</Text>
      <Text className="text-sm text-subtext">{props.message}</Text>
    </View>
  </View>
}

export default function Notifications() {
  const { rest } = directusStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const navigation = useNavigation()

  useEffect(() => {
    async function fetchNotifications() {
      const _notifications = await queryClient.fetchQuery({
        queryKey: fetchNotificationsQueryKey,
        queryFn: async () => await rest.request(readNotifications({
          filter: {
            status: {
              _eq: "inbox"
            }
          }
        })),
        initialData: []
      })
      setNotifications(_notifications)
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header>
        <View className="flex-row gap-1">
          <Text>Notifications</Text>
          {notifications.length ? <Text>{`(${notifications.length})`}</Text> : <></>}
        </View>
      </Header>
    })
  }, [notifications, navigation])

  return <FlatList
    data={notifications}
    renderItem={({ item }) => <RenderNotifications {...item} setNotifications={setNotifications} />}
    ItemSeparatorComponent={() => <Separator />}
  />
}
