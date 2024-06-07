import { Separator } from 'app/components/ui/separator';
import { useListingMetrics } from "app/hooks/listing-metrics";
import { directusUrl } from "app/lib/constants";
import { buildAssetUrl, getDMRoomId } from "app/lib/helpers";
import { Amenity, Listing, ListingAmenity, User } from "app/lib/types";
import userStore from "app/store/user";
import { Bath, BedDouble, Bookmark, Building, CarFront, ExternalLink, Eye, LandPlot } from "app/components/icons";
import { ReactNode, useMemo } from "react";
import { Dimensions, FlatList, Image, Linking, View } from "react-native";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import { useColorScheme } from 'app/hooks/color-scheme';
import directusStore from 'app/store/directus';
import { GoToProfileButton, GoToRoomButton } from 'app/components/link-buttons';
import { Link } from 'solito/link';
import Carousel from 'react-native-reanimated-carousel';
import opacity from 'hex-color-opacity';

export const FullListingCardFields = ["*", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email", "amenities.additional_value", "amenities.amenities_id.*", "photo1", "photo2", "photo3"]

export const ListingIconTile = ({
    icon,
    text,
    value,
}: {
    icon: ReactNode;
    text: string;
    value: number | string;
}) => {
    return (
        <View>
            <View className="flex-row gap-2 items-center">
                {icon}
                <Text className="font-bold">{value}</Text>
            </View>
            <Text className="text-sm text-subtext">{text}</Text>
        </View>
    );
};

export type DetailedAmenity = ListingAmenity & { amenities_id: Amenity }

export type FullListingDetailed = Listing & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email"> } & { amenities: DetailedAmenity[] }

const Amenities = (props: DetailedAmenity) => {
    return <View className="p-4 rounded w-[45%] border border-solid border-border">
        <View className="gap-2 flex-row items-center">
            {/* <MaterialIcons name="signal-wifi-0-bar" size={24} className="!text-foreground !text-base" /> */}
            <Text className="text-sm">{props.amenities_id.label}</Text>
        </View>
        <Text>{props.additional_value}</Text>
    </View>
}

export type ListingCardMetrics = { views: string | null, saves: string | null }

export const FullListingCard = (props: FullListingDetailed) => {
    const { views, saves, addBookmark, deleteBookmark, bookmarkId } = useListingMetrics(props.id)
    const { user } = userStore()
    const { colors } = useColorScheme()
    const { authenticated } = directusStore()
    const photos = useMemo(() => [props.photo_1, props.photo_2, props.photo_3].filter(photo => photo) as string[], [props.photo_1, props.photo_2, props.photo_3])
    const width = Dimensions.get('window').width
    const height = width * (9 / 16)

    const handleSave = async () => {
        bookmarkId ? await deleteBookmark(props.id, bookmarkId) : await addBookmark({ id: props.id, title: props.title }, { email: props.user_created.email, id: props.user_created.id })
    }

    return <View className="flex-col gap-8">
        <View className='px-4 flex flex-col gap-4'>
            <View className="flex-col gap-2">
                <Text className="text-xl font-medium text-primary">{props.title}</Text>
                <View className="flex-row gap-4">
                    <Text className="">AED {Number(props.price).toLocaleString()}</Text>
                    <Text style={{ backgroundColor: opacity(colors.info, 0.1) }} className='p-1 rounded text-sm text-info'>Expected broker fees: {props.expected_broker_fees} % </Text>
                </View>
            </View>
            <View className="flex-row items-start gap-4">
                <Text className="border border-solid border-primary text-primary px-2 rounded-full">{props.type}</Text>
                <Text className="border border-solid border-foreground px-2 rounded-full">{props.deal_type}</Text>
            </View>
        </View>
        <Text className='px-4'>{props.description}</Text>
        <Separator className='px-4' />
        {photos.length ? <Carousel
            style={{marginTop: -32}}
            loop={false}
            height={height}
            data={photos}
            renderItem={({ item, index }) => <View style={{ width, height }} className='relative'>
                <Image source={{ uri: buildAssetUrl(item) }} className='w-full h-full' />
                <View className='absolute bottom-4 left-4 bg-dark rounded p-1'>
                    <Text className='text-light text-xs'>{index + 1} / 3</Text>
                </View>
            </View>}
            width={width}
        /> : <></>}
        {props.tags.length ?
            <View className="flex-row gap-4 px-4">
                {props.tags.map((tag, index) => <Text className="text-sm bg-primary text-primary-foreground px-2 rounded" key={index}>{tag}</Text>)}
            </View> : <></>}
        <View className="flex flex-row justify-between px-4">
            {<ListingIconTile
                icon={<LandPlot className="!text-base !text-foreground" />}
                text='Size'
                value={`${props.carpet_area} sqft`}
            />}
            {props.bedrooms ? (
                <ListingIconTile
                    icon={<BedDouble className="!text-base !text-foreground" />}
                    text="Beds"
                    value={props.bedrooms}
                />
            ) : <></>}
            {props.bathrooms ? (
                <ListingIconTile
                    icon={<Bath className="!text-base !text-foreground" />}
                    text="Baths"
                    value={props.bathrooms}
                />
            ) : <></>}
            {props.garages ? (
                <ListingIconTile
                    icon={<CarFront className="!text-base !text-foreground" />}
                    text="Parking"
                    value={props.garages}
                />
            ) : <></>}
        </View>
        {props.amenities && props.amenities.length ? <View className="flex-col gap-4 px-4">
            <Separator />
            <Text className="text-lg font-medium">Amenities</Text>
            <FlatList
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View className="w-4 h-4" />}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-evenly' }}
                data={props.amenities}
                renderItem={({ item }) => Amenities(item)}
            />
        </View> : <></>}
        <Separator className='px-4' />
        <View className="flex-row gap-4 items-center px-4">
            <Text className="text-lg">Pro Member</Text>
            <Text>{props.user_created.computed_rating}</Text>
        </View>
        <View className="flex-row gap-4 items-center px-4">
            <Image source={{ uri: buildAssetUrl(props.user_created.avatar) }} className="rounded w-28 h-28" />
            <View className="flex-col gap-2">
                <View>
                    <Text className="text-lg font-medium">{props.user_created.first_name} {props.user_created.last_name}</Text>
                    <Link href={`mailto:${props.user_created.email}`}>
                        <Text className="text-info">{props.user_created.email}</Text>
                    </Link>
                </View>
                <View className="flex-row gap-2">
                    {user.id === props.user_created.id ? <></> : <GoToRoomButton disabled={!authenticated} roomId={getDMRoomId([props.user_created.id, user.id])} size={"sm"} variant={"outline"}><Text className="!text-sm">Chat</Text></GoToRoomButton>}
                    <GoToProfileButton disabled={!authenticated} userId={props.user_created.id} size={"sm"} variant={"outline"}><Text className="!text-sm">Profile</Text></GoToProfileButton>
                </View>
            </View>
        </View>
        <Separator />
        {(views !== null && saves !== null && views !== undefined && saves !== undefined) ? <View className="flex-row gap-4 justify-around px-4">
            <View className="flex-col gap-2 items-center">
                <Eye className="!text-foreground" size={18} />
                <Text className="text-sm text-subtext">{views} Views</Text>
            </View>
            <Button disabled={!authenticated} variant={"base"} size={"none"} onPress={handleSave} className="flex-col gap-2 items-center">
                <Bookmark fill={bookmarkId ? colors.foreground : "transparent"} className="!text-foreground" size={18} />
                <Text className="text-sm text-subtext">{saves} Saves</Text>
            </Button >
            <Button variant={"base"} size={"none"} onPress={() => Linking.openURL(`${directusUrl}/admin/content/listings/${props.id}`)} className="flex-col gap-2 items-center">
                <ExternalLink className="!text-foreground" size={18} />
                <Text className="text-sm text-subtext">Dashboard</Text>
            </Button >
        </View> : <></>}
    </View>
}