import { Header } from "app/components/header";
import { Bath, BedDouble, Bookmark, CarFront, ExternalLink, Eye, LandPlot } from "app/components/icons";
import { Separator } from 'app/components/ui/separator';
import { ScrollView } from "app/components/utils/virtual-lists";
import { useColorScheme } from 'app/hooks/color-scheme';
import { useListingMetrics } from "app/hooks/listing-metrics";
import { directusUrl } from "app/lib/constants";
import { buildAssetUrl, groupByN, shortString } from "app/lib/helpers";
import { FullListingDetailedProps } from "app/lib/props";
import { RenderAmenity } from 'app/screens/post';
import directusStore from 'app/store/directus';
import userStore from "app/store/user";
import opacity from 'hex-color-opacity';
import { ReactNode, useMemo } from "react";
import { Dimensions, Image, Linking, View } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import { MediumUsersCard } from './users';

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
                <Text className="font-semibold">{value}</Text>
            </View>
            <Text className="text-sm text-subtext">{text}</Text>
        </View>
    );
};

export type ListingCardMetrics = { views: string | null, saves: string | null }

export const FullListingCard = (props: FullListingDetailedProps) => {
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

    return <View className="flex-col gap-4 flex-1 pb-4">
        <Header>
            <Text className="font-bold text-xl">{shortString(props.title, 30)}</Text>
        </Header>
        <ScrollView contentContainerClassName="flex-col gap-8 flex-grow max-w-xl">
            <View className='px-4 flex flex-col gap-4'>
                <View className="flex-col gap-2">
                    <Text className="text-xl font-medium text-primary">{props.title}</Text>
                    <View className="flex-row gap-4 flex-wrap">
                        <Text className="text-success">AED {Number(props.budget).toLocaleString()}</Text>
                        <Text style={{ backgroundColor: opacity(colors.info, 0.1) }} className='p-1 rounded text-sm text-info'>Expected broker fees: {props.expected_broker_fees} % </Text>
                        <Text className="border border-solid border-foreground px-2 rounded-full self-start capitalize">{props.deal_type}</Text>
                    </View>
                </View>
            </View>
            <Text className='px-4'>{props.description}</Text>
            <Separator />
            {photos.length ?
                <View>
                    <Separator />
                    <Carousel
                        style={{ marginTop: -32 }}
                        loop={false}
                        height={height}
                        data={photos}
                        renderItem={({ item, index }: { item: string, index: number }) => <View style={{ width, height }} className='relative'>
                            <Image source={{ uri: buildAssetUrl(item) }} className='w-full h-full' />
                            <View className='absolute bottom-4 left-4 bg-dark rounded p-1'>
                                <Text className='text-light text-xs'>{index + 1} / {photos.length}</Text>
                            </View>
                        </View>}
                        width={width}
                    />
                    <Separator />
                </View>
                : <></>}
            {props.tags?.length ?
                <View className="flex-row gap-4 px-4">
                    {props.tags.map((tag, index) => <Text className="text-sm bg-primary text-primary-foreground px-2 rounded" key={index}>{tag}</Text>)}
                </View> : <></>}
            <View className="flex flex-row justify-between px-4">
                {<ListingIconTile
                    icon={<LandPlot className="!text-base !text-foreground" />}
                    text='Size'
                    value={`${props.size} sqft`}
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
                {props.parking ? (
                    <ListingIconTile
                        icon={<CarFront className="!text-base !text-foreground" />}
                        text="Parking"
                        value={props.parking}
                    />
                ) : <></>}
            </View>
            <Separator />
            {props.amenities && props.amenities.length ? <View className="flex-col gap-4 px-4 -mt-4">
                <Text className="text-lg font-medium">Amenities</Text>
                {groupByN(props.amenities).map((_amenities, i) => <View key={i} className="flex-row gap-4 w-full">
                    {_amenities.map((amenity, j) => <View className="flex-1" key={j}>
                        <RenderAmenity {...amenity} />
                    </View>)}
                </View>)}
            </View> : <></>}
            <Separator className='' />
            <View className='p-4'>
                <MediumUsersCard {...props.user_created} />
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
        </ScrollView>
    </View>
}