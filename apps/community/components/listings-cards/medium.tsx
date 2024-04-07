import { router } from "expo-router"
import React from "react"
import { View, Image } from "react-native"
import { buildAssetUrl } from "~/lib/helpers"
import { Listing, User } from "~/types"
import { Text } from "../ui/text"
import { Button } from "../ui/button"
import { Feather, FontAwesome } from '@expo/vector-icons';

export type MediumListCardProps = Pick<Listing, "id" | "title" | "price" | "location"> & { user_created: Pick<User, "id" | "avatar"> }

export const MediumListCard = (item: MediumListCardProps) => {
    return <View className="border-solid border-hairline border-border p-4 flex-row gap-4 bg-card items-start">
        <Image source={{ uri: buildAssetUrl(item.user_created.avatar) }} className="w-8 h-8 rounded-full" />
        <View className="flex-col gap-4">
            <View>
                <Text className="text-lg font-medium">{item.title}</Text>
                <Text className="text-muted-foreground">{item.location}</Text>
                <View className="flex-row justify-between gap-4 items-center">
                    <Text className="text-muted-foreground">AED {Number(item.price).toLocaleString()}</Text>
                    <Text className="border-solid rounded-full border-foreground border px-2 my-1">Listing</Text>
                </View>
            </View>
            <View className="flex-row justify-between items-center">
                <Button onPress={() => router.push(`/${item.id}`)} variant={"ghost"} className="flex flex-row gap-2 items-center">
                    <Text>Details</Text>
                    <Feather name="external-link" className="!text-foreground !text-base" />
                </Button>
                <View className="flex-row gap-4">
                    <View className="flex-row gap-2">
                        <FontAwesome name="star" className="!text-yellow-600 !text-base" />
                        <Text>12</Text>
                    </View>
                    <View className="flex-row gap-2">
                        <FontAwesome name="comments" className="!text-foreground !text-base" />
                        <Text>23</Text>
                    </View>
                </View>
            </View>
        </View>
    </View >
}