import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext, useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/context/auth";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl, getDMRoomId } from "~/lib/helpers";
import { Listing, User } from "~/types";
import { Hr } from "~/components/ui/hr";
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from "~/components/ui/button";
import { SearchBar } from "@rneui/themed";
import { useDebounce } from "@uidotdev/usehooks";
import { UserContext } from "~/context/user";
import { Link, router } from "expo-router";

type ListingDetailed = Listing & { user_created: User }

const ListingIconTile = ({ icon, text, value }: { icon: ReactNode, text: string, value: number }) => {
    return <View>
        <View className="flex-row gap-2 items-center">
            {icon}
            <Text className="font-bold"> {value} </Text>
        </View>
        <Text className="font-light text-muted-foreground"> {text} </Text>
    </View>
}

const ListingCard = (props: ListingDetailed) => {
    const userData = useContext(UserContext)
    const authData = useContext(AuthContext)

    const handleClickToChat = async ([currentUserId, postCreatorId]: [string, string]) => {
        const roomId = await getDMRoomId([currentUserId, postCreatorId], authData?.access_token!)
        router.navigate(`/chat/${roomId}`)
    }

    return <View className="w-full px-4 py-6 flex flex-col gap-3 [&>*]:my-0 border-solid border-[1px] border-primary-foreground rounded">
        <Text className="text-2xl font-extrabold">{props.title}</Text>
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
                <MaterialIcons size={18} color={"white"} name="location-pin" />
                <Text className="text-muted-foreground">{props.location}</Text>
            </View>
            <View className="flex-row items-center gap-2">
                <MaterialIcons size={18} color={"white"} name="calendar-month" />
                <Text className="text-muted-foreground">{new Date(props.date_created).toLocaleTimeString()}</Text>
            </View>
        </View>
        <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row gap-4">
                {props.tags.map((tag, i) =>
                    <Text key={i} className="bg-primary px-1 rounded text-primary-foreground w-auto text-sm">{tag}</Text>)}
            </View>
            <Text className="bg-primary px-1 rounded text-primary-foreground w-auto text-sm"> For {props.type} </Text>
        </View>
        <View className="flex-row gap-4 items-center">
            <Text className="text-green-400 font-extrabold text-xl">AED {Number(props.price).toLocaleString()} </Text>
            <Text className="border-solid border-[1px] border-primary rounded-full px-1 text-sm">{props.mode_of_payment}</Text>
            <Text className="border-solid border-[1px] border-primary rounded-full px-1 text-sm"> <Text className="text-muted-foreground text-sm font-light">Expected fee</Text> {Number(props.expected_broker_fees).toLocaleString()} % </Text>
        </View>
        <Hr />
        <Text className="text-xl font-extrabold"> {Number(props.carpet_area).toLocaleString()} sq ft</Text>
        <View className="flex flex-row justify-between">
            {props.bedrooms && <ListingIconTile icon={<MaterialIcons name="bed" size={18} color={"white"} />} text="Beds" value={props.bedrooms} />}
            {props.bathrooms && <ListingIconTile icon={<MaterialIcons name="bathtub" size={18} color={"white"} />} text="Baths" value={props.bathrooms} />}
            {props.garages && <ListingIconTile icon={<MaterialIcons name="garage" size={18} color={"white"} />} text="Garages" value={props.garages} />}
            {props.floors && <ListingIconTile icon={<MaterialIcons name="stairs" size={18} color={"white"} />} text="Floors" value={props.floors} />}
        </View>
        <Hr />
        <View className="flex-row justify-between items-center">
            {userData?.id !== props.user_created.id ? <Button onPress={() => handleClickToChat([userData?.id!, props.user_created.id])} variant="outline">
                <Text> Chat </Text>
            </Button>
                : <View></View>}
            <View className="flex-row gap-4 justify-start items-center">
                <Image className="w-8 h-8 rounded-full" source={{ uri: buildAssetUrl(props.user_created.avatar) }} />
                <Text className="">{props.user_created.first_name}</Text>
            </View>
        </View>
    </View>
}

export default function Listings() {
    const authData = useContext(AuthContext)
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce([searchText], 500)

    const { data: allData, isLoading } = useQuery({
        queryKey: ["Get Listings"],
        queryFn: () => fetch(`${directusUrl}/items/listings?fields=*,user_created.*`, {
            headers: {
                "Authorization": `Bearer ${authData?.access_token}`
            }
        }).then(res => res.json())
    })
    const { data: filteredData, isLoading: filteredLoading } = useQuery({
        queryKey: ["Get Filtered Listings", debouncedSearchText],
        queryFn: () => fetch(`${directusUrl}/items/listings?fields=*,user_created.*&search=${debouncedSearchText}`, {
            headers: {
                "Authorization": `Bearer ${authData?.access_token}`
            }
        }).then(res => res.json()),
        enabled: !!debouncedSearchText
    })

    if (isLoading) return <View></View>
    const allListings = allData.data
    const filteredListings = filteredData?.data

    return <View className="web:max-w-lg w-full mx-auto flex-1">
        <FlatList
            ListHeaderComponent={<SearchBar
                placeholder="Search ..."
                showLoading={filteredLoading}
                round={true}
                containerStyle={{ backgroundColor: "transparent" }}
                inputContainerStyle={{ backgroundColor: "transparent", borderColor: "gray", borderWidth: 1, borderStyle: "solid", borderRadius: 9999, borderBottomWidth: 1 }}
                inputStyle={{ color: "white" }} value={searchText} onChangeText={(val) => setSearchText(val)}
                className="outline-none"
            />}
            data={filteredListings || allListings}
            renderItem={(({ item }) => <ListingCard {...item} />)}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-4"></View>}
        ></FlatList>
    </View>
}