import { createItem, deleteItems, readItems } from "@directus/sdk";
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { FlatList, Image, Linking, Pressable, View } from "react-native";
import { queryClient } from "~/index";
import { directusUrl } from "~/lib/constants";
import { UserCount, addBookmark, buildAssetUrl, deleteBookmark, getDMRoomId, getListingMetrics, savesCountKey } from "~/lib/helpers";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { Amenity, Listing, ListingAmenity, User } from "~/types";
import { Button } from "../../ui/button";
import { Hr } from "../../ui/hr";
import { Text } from "../../ui/text";
import { useListingMetrics } from "~/hooks/listing-metrics";

export const ListingIconTile = ({
    icon,
    text,
    value,
}: {
    icon: ReactNode;
    text: string;
    value: number;
}) => {
    return (
        <View>
            <View className="flex-row gap-2 items-center">
                {icon}
                <Text className="font-bold">{value}</Text>
            </View>
            <Text className="font-light text-subtext">{text}</Text>
        </View>
    );
};

export type DetailedAmenity = ListingAmenity & { amenities_id: Amenity }

export type FullListingDetailed = Listing & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email"> } & { amenities: DetailedAmenity[] }

const Amenities = (props: DetailedAmenity) => {
    return <View className="p-4 rounded w-[45%] border border-solid border-border">
        <View className="gap-2 flex-row items-center">
            <MaterialIcons name="signal-wifi-0-bar" size={24} className="!text-foreground !text-base" />
            <Text className="text-sm">{props.amenities_id.label}</Text>
        </View>
        <Text>{props.additional_value}</Text>
    </View>
}

export type ListingCardMetrics = { views: string | null, saves: string | null }

export const FullListingCard = (props: FullListingDetailed) => {
    const { views, saves, addBookmark, deleteBookmark, bookmarkId } = useListingMetrics(props.id)
    const { user } = userStore()

    const handleSave = async () => {
        bookmarkId ? await deleteBookmark(props.id, bookmarkId) : await addBookmark(props.id)
    }

    const handleChat = async () => {
        const roomId = await getDMRoomId([props.user_created.id, user.id])
        router.navigate(`/chat/${roomId}`)
    }

    return <View className="flex-col gap-4 p-2">
        <View className="flex-col gap-2">
            <Text className="text-xl font-medium text-primary">{props.title}</Text>
            <Text className="text-subtext">{props.address}</Text>
            <View className="flex-row gap-4">
                <Text className="">AED {Number(props.price).toLocaleString()}</Text>
                <FlatList
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <Text className="text-subtext"> | </Text>}
                    horizontal={true}
                    data={props.mode_of_payments}
                    renderItem={({ item }) => <Text className="text-subtext">{item}</Text>}
                />
            </View>
        </View>
        <View className="flex-row items-start gap-4">
            <Text className="border border-solid border-primary text-primary px-2 rounded-full">{props.type}</Text>
            <Text className="border border-solid border-foreground px-2 rounded-full">{props.deal_type}</Text>
        </View>
        <Text>{props.description}</Text>
        <Text className="font-medium text-primary">Carpet Area {props.carpet_area} Sq Ft</Text>
        <View className="flex-row gap-4">
            {props.tags.map((tag, index) => <Text className="text-sm bg-primary text-primary-foreground px-2 rounded" key={index}>{tag}</Text>)}
        </View>
        <View className="flex flex-row justify-between">
            {props.bedrooms && (
                <ListingIconTile
                    icon={<MaterialIcons name="bed" className="!text-base !text-foreground" />}
                    text="Beds"
                    value={props.bedrooms}
                />
            )}
            {props.bathrooms && (
                <ListingIconTile
                    icon={<MaterialIcons name="bathtub" className="!text-base !text-foreground" />}
                    text="Baths"
                    value={props.bathrooms}
                />
            )}
            {props.garages && (
                <ListingIconTile
                    icon={<MaterialIcons name="garage" className="!text-base !text-foreground" />}
                    text="Garages"
                    value={props.garages}
                />
            )}
            {props.floors && (
                <ListingIconTile
                    icon={<MaterialIcons name="stairs" className="!text-base !text-foreground" />}
                    text="Floors"
                    value={props.floors}
                />
            )}
        </View>
        {props.amenities && props.amenities.length ? <View className="flex-col gap-4">
            <Hr />
            <Text className="text-lg">Amenities</Text>
            <FlatList
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View className="w-4 h-4" />}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-evenly' }}
                data={props.amenities}
                renderItem={({ item }) => Amenities(item)}
            />
        </View> : <View></View>}
        <Hr />
        <View className="flex-row gap-4 items-center">
            <Text className="text-lg">Pro Member</Text>
            <Text>4.7</Text>
        </View>
        <View className="flex-row gap-4 items-center">
            <Image source={{ uri: buildAssetUrl(props.user_created.avatar) }} className="rounded w-28 h-28" />
            <View className="flex-col gap-2">
                <View>
                    <Text className="text-lg font-medium">{props.user_created.first_name} {props.user_created.last_name}</Text>
                    <Text className="text-subtext">{props.user_created.email}</Text>
                </View>
                <View className="flex-row gap-2">
                    <Button onPress={handleChat} size={"sm"} variant={"outline"}><Text className="!text-sm">Chat</Text></Button>
                    <Button onPress={() => router.navigate(`/profile/${props.user_created.id}`)} size={"sm"} variant={"outline"}><Text className="!text-sm">Profile</Text></Button>
                </View>
            </View>
        </View>
        <Hr />
        {(views !== null && saves !== null && views !== undefined && saves !== undefined) ? <View className="flex-row gap-4 justify-around">
            <View className="flex-col gap-2 items-center">
                <Ionicons name="eye" className="!text-foreground" size={18} />
                <Text className="text-sm text-subtext">{views} Views</Text>
            </View>
            <Pressable onPress={handleSave} className="flex-col gap-2 items-center">
                <Ionicons name={bookmarkId ? "bookmark" : "bookmark-outline"} className="!text-foreground" size={18} />
                <Text className="text-sm text-subtext">{saves} Saves</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(`${directusUrl}/admin/content/listings/${props.id}`)} className="flex-col gap-2 items-center">
                <Feather name="external-link" className="!text-foreground" size={18} />
                <Text className="text-sm text-subtext">Dashboard</Text>
            </Pressable>
        </View> : <></>}
    </View>
}