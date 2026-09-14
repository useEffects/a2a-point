import {
  Bath,
  BedDouble,
  Bookmark,
  CarFront,
  ExternalLink,
  Eye,
  LandPlot,
} from 'app/components/icons';
import { Separator } from 'app/components/ui/separator';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useListingMetrics } from 'app/hooks/listing-metrics';
import { directusUrl } from 'app/lib/constants';
import { buildAssetUrl } from 'app/lib/helpers';
import {
  FullListingDetailedProps,
  ListingCardMetrics,
  UsersCardMetrics,
} from 'app/lib/props';
import { RenderAmenities } from 'app/screens/post';
import { directusStore } from 'app/store/directus';
import opacity from 'hex-color-opacity';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Dimensions, Linking, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button } from '../../ui/button';
import { Text } from '../../ui/text';
import { MediumUsersCard } from './users';
import { useLocalizedCost } from 'app/hooks/locale-string';
import { AsyncImage } from 'app/components/async-image';

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

export const FullListingCard = (
  props: FullListingDetailedProps & UsersCardMetrics & ListingCardMetrics,
) => {
  const { addBookmark, deleteBookmark, bookmarkId, isLoading } =
    useListingMetrics(props.id);
  const { colors } = useColorScheme();
  const { authenticated } = directusStore();
  const photos = useMemo(
    () =>
      [props.photo_1, props.photo_2, props.photo_3].filter(
        (photo) => photo,
      ) as string[],
    [props.photo_1, props.photo_2, props.photo_3],
  );
  const width = Dimensions.get('window').width;
  const height = width * (9 / 16);
  const localizedCost = useLocalizedCost(
    props.deal_type,
    props.budget,
    props.price,
  );
  const [currentSaves, setCurrentSaves] = useState(Number(props.saves));

  const handleSave = async () => {
    if (bookmarkId) {
      await deleteBookmark();
      setCurrentSaves((p) => p - 1);
    } else {
      await addBookmark({
        listing: { id: props.id, title: props.title },
        recipient: {
          email: props.user_created.email,
          id: props.user_created.id,
        },
      });
      setCurrentSaves((p) => p + 1);
    }
  };

  return (
    <View className="flex-col gap-4 flex-1 pb-4">
      <View className="flex-col gap-8 flex-grow max-w-xl">
        <View className="px-4 flex flex-col gap-4">
          <View className="flex-col gap-2">
            <Text className="text-xl font-medium text-primary">
              {props.title}
            </Text>
            <View className="flex-row gap-4 flex-wrap">
              <Text className="text-success">AED {localizedCost}</Text>
              <Text
                style={{ backgroundColor: opacity(colors.info, 0.1) }}
                className="p-1 rounded text-sm text-info"
              >
                Expected broker fees: {props.expected_broker_fees} %
              </Text>
              <Text className="border border-solid border-foreground px-2 rounded-full self-start capitalize">
                {props.deal_type}
              </Text>
            </View>
          </View>
        </View>
        <Text className="px-4">{props.description}</Text>
        <Separator />
        {photos.length ? (
          <View>
            <Separator />
            <Carousel
              style={{ marginTop: -32 }}
              loop={false}
              height={height}
              data={photos}
              renderItem={({
                item,
                index,
              }: {
                item: string;
                index: number;
              }) => (
                <View style={{ width, height }} className="relative">
                  <AsyncImage
                    source={{ uri: buildAssetUrl(item) }}
                    className="w-full h-full"
                  />
                  <View className="absolute bottom-4 left-4 bg-dark rounded p-1">
                    <Text className="text-light text-xs">
                      {index + 1} / {photos.length}
                    </Text>
                  </View>
                </View>
              )}
              width={width}
            />
            <Separator />
          </View>
        ) : (
          <></>
        )}
        {props.tags?.length ? (
          <View className="flex-row gap-4 px-4">
            {props.tags.map((tag, index) => (
              <Text
                className="text-sm bg-primary text-primary-foreground px-2 rounded"
                key={index}
              >
                {tag}
              </Text>
            ))}
          </View>
        ) : (
          <></>
        )}
        <View className="flex flex-row justify-between px-4">
          {
            <ListingIconTile
              icon={
                <LandPlot
                  size={18}
                  color={colors.foreground}
                  className="!text-base !text-foreground"
                />
              }
              text="Size"
              value={`${props.size} sqft`}
            />
          }
          {props.bedrooms ? (
            <ListingIconTile
              icon={
                <BedDouble
                  size={18}
                  color={colors.foreground}
                  className="!text-base !text-foreground"
                />
              }
              text="Beds"
              value={props.bedrooms}
            />
          ) : (
            <></>
          )}
          {props.bathrooms ? (
            <ListingIconTile
              icon={
                <Bath
                  size={18}
                  color={colors.foreground}
                  className="!text-base !text-foreground"
                />
              }
              text="Baths"
              value={props.bathrooms}
            />
          ) : (
            <></>
          )}
          {props.parking ? (
            <ListingIconTile
              icon={
                <CarFront
                  size={18}
                  color={colors.foreground}
                  className="!text-base !text-foreground"
                />
              }
              text="Parking"
              value={props.parking}
            />
          ) : (
            <></>
          )}
        </View>
        {props.amenities && props.amenities.length ? (
          <View>
            <Separator />
            <View className="p-4">
              <RenderAmenities amenities={props.amenities} />
            </View>
          </View>
        ) : (
          <></>
        )}
        <Separator className="" />
        <View className="p-4">
          <MediumUsersCard {...props} {...props.user_created} />
        </View>
        <Separator />
        {props.views !== null &&
        props.saves !== null &&
        props.views !== undefined &&
        props.saves !== undefined ? (
          <View className="flex-row gap-4 justify-around px-4">
            <View className="flex-col gap-2 items-center">
              <Eye className="!text-foreground" size={18} />
              <Text className="text-sm text-subtext">{props.views} views</Text>
            </View>
            <Button
              disabled={!authenticated || isLoading}
              variant={'base'}
              size={'none'}
              onPress={handleSave}
              className="flex-col gap-2 items-center"
            >
              <Bookmark
                fill={bookmarkId ? colors.foreground : 'transparent'}
                className="!text-foreground"
                size={18}
              />
              <Text className="!text-sm !text-subtext">
                {currentSaves} saves
              </Text>
            </Button>
            <Button
              variant={'base'}
              size={'none'}
              onPress={() =>
                Linking.openURL(
                  `${directusUrl}/admin/content/listings/${props.id}`,
                )
              }
              className="flex-col gap-2 items-center"
            >
              <ExternalLink className="!text-foreground" size={18} />
              <Text className="!text-sm !text-subtext">Dashboard</Text>
            </Button>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};
