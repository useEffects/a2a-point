import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';
import { Text } from 'app/components/ui/text';
import { UserChip, UserChipSkeleton } from 'app/components/user-chip';
import { useLocalizedCost } from 'app/hooks/locale-string';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { Listing, User } from 'app/lib/types';
import { Dimensions, Image, Pressable, View } from 'react-native';

export type PhotoListingProps = Pick<
  Listing,
  | 'id'
  | 'title'
  | 'budget'
  | 'deal_type'
  | 'photo_1'
  | 'photo_2'
  | 'photo_3'
  | 'price'
> & {
  user_created: Pick<
    User,
    'id' | 'avatar' | 'first_name' | 'last_name' | 'plan'
  >;
};

export const PhotoListingCard = (item: PhotoListingProps) => {
  const router = useRouter();

  const photo = item.photo_1 || item.photo_2 || item.photo_3;
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth / 2;
  const imageHeight = (9 / 16) * imageWidth;
  const localizedCost = useLocalizedCost(
    item.deal_type,
    item.budget,
    item.price,
  );

  return (
    <Pressable
      onPress={() => router.push(`/listings/${item.id}`)}
      className="rounded-xl bg-accent text-wrap border-border flex-col justify-between border-[1px] border-solid border-border"
      style={{ height: imageHeight * 2 }}
    >
      <AsyncImage
        source={{ uri: buildAssetUrl(photo) }}
        width={imageWidth}
        height={imageHeight}
        className="rounded-tl-xl rounded-tr-xl"
      />
      <View
        className="flex-col gap-2 px-2 py-4 items-start w-full"
        style={{ width: imageWidth }}
      >
        <UserChip user={item.user_created} />
        <Text className="text-wrap">{item.title}</Text>
        <View className="flex-row gap-4 justify-between w-full mt-auto mb-0">
          <Text className="text-success">AED {localizedCost}</Text>
          <Text className="capitalize text-info">{item.deal_type}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const PhotoListingCardSkeleton = () => {
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth / 2;
  const imageHeight = (9 / 16) * imageWidth;
  return (
    <View
      className="border-border flex-col justify-between bg-accent rounded border-solid border-[1px]"
      style={{ width: imageWidth, height: imageHeight * 2 }}
    >
      <View style={{ width: imageWidth, height: imageHeight }}>
        <Skeleton className="w-full h-full" />
      </View>
      <View className="p-4 flex-col gap-2 items-start w-full">
        <UserChipSkeleton />
        <Skeleton className="w-[90%] h-4" />
        <View className="flex-row justify-between w-full">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </View>
      </View>
    </View>
  );
};

export const PriceSkeleton = () => <Skeleton className="h-4 w-28" />;
export const ListingTypeSkeleton = () => <Skeleton className="h-4 w-12" />;
