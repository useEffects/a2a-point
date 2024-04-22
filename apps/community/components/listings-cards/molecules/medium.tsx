import { router } from "expo-router"
import React from "react"
import { View, Image } from "react-native"
import { buildAssetUrl, getDMRoomId, shortString } from "~/lib/helpers"
import { Listing, User } from "~/types"
import { Text } from "../../ui/text"
import { Button } from "../../ui/button"
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { OpenDetailsButton, RenderMetrics } from "./small"
import userStore from "~/store/user"

export type MediumListingCardProps = Pick<Listing, "id" | "title" | "price" | "address" | "type" | "deal_type" | "description"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email"> }

export const UserProfileCard = (item: { user_created: Pick<User, "first_name" | "last_name" | "email" | "avatar"> }) => {
    return <View className="flex-row gap-2 items-center">
        <Image source={{ uri: buildAssetUrl(item.user_created.avatar) }} className="w-6 h-6 rounded-full" />
        <Text className="text-sm">{item.user_created.first_name} {item.user_created.last_name}</Text>
        <Text className="text-sm text-subtext">{item.user_created.email}</Text>
    </View>
}

export const MediumListingCard = (item: MediumListingCardProps) => {
    const { user } = userStore()

    return <View className="w-full flex-col gap-2 px-2 my-4">
        <UserProfileCard user_created={item.user_created} />
        <Text className="text-lg text-primary">{item.title}</Text>
        <View className="flex-col gap-1 bg-card rounded-2xl p-4 mt-2">
            <Text className="text-subtext">{item.address}</Text>
            <View className="flex-row justify-between">
                <Text className="text-success">AED {Number(item.price).toLocaleString()}</Text>
                <View className="flex-row gap-2">
                    <Text className="text-info">{item.deal_type}</Text>
                    <Text className="text-subtext">|</Text>
                    <Text className="text-primary">{item.type}</Text>
                </View>
            </View>
            <Text>{shortString(item.description, 150)}</Text>
        </View>
        <View className="flex-row justify-between items-center px-2">
            <RenderMetrics listingId={item.id} />
            <View className="mr-0 ml-auto flex-row">
                <Button size="icon" variant="ghost" onPress={async () => router.navigate(`/chat/${await getDMRoomId([user.id, item.user_created.id])}`)}>
                    <MaterialIcons size={18} name="chat" className="!text-foreground" />
                </Button>
                <Button size="icon" variant="ghost" onPress={() => router.navigate(`/profile/${item.user_created.id}`)}>
                    <MaterialIcons size={18} name="person" className="!text-foreground" />
                </Button>
                <Button size="icon" variant="ghost" onPress={() => router.navigate(`/${item.id}`)}>
                    <MaterialIcons size={18} name="arrow-outward" className="!text-foreground" />
                </Button>
            </View>
        </View>
    </View>
}