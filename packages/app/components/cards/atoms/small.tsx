import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';
import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { LocationChip, LocationChipSkeleton } from 'app/components/utils/chips';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useLocalizedCost } from 'app/hooks/locale-string';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl, timeAgo } from 'app/lib/helpers';
import { ListingCardMetrics } from 'app/lib/props';
import { Listing, Room, User } from 'app/lib/types';
import opacity from 'hex-color-opacity';
import { Bookmark, ExternalLink, Eye } from 'lucide-react-native';
import { Dimensions, Image, Platform, Pressable, View } from 'react-native';
import { ListingTypeSkeleton, PriceSkeleton } from './photo';
import { MetricsSkeleton } from './medium';

export const OpenDetailsButton = ({
  id,
  size = 'sm',
}: {
  id: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
}) => {
  const router = useRouter();

  return (
    <Button
      onPress={() => router.push(`/${id}`)}
      size={size}
      variant={'ghost'}
      className="flex flex-row gap-2 items-center"
    >
      <Text>Details</Text>
      <ExternalLink className="!text-foreground !text-base" />
    </Button>
  );
};

export type SmallListingCardProps = Pick<
  Listing,
  'id' | 'title' | 'budget' | 'deal_type' | 'tags' | 'date_created' | 'price'
> & { user_created: Pick<User, 'id' | 'avatar'> } & {
  location: Pick<Room, 'id' | 'title' | 'avatar'>;
};

export const RenderMetrics = ({ metrics }: { metrics: ListingCardMetrics }) => {
  const { colors } = useColorScheme();

  return (
    <View className="flex flex-row gap-4">
      {metrics ? (
        <>
          <View className="flex flex-row gap-2 items-center">
            <Eye size={18} color={colors.foreground} />
            <Text>{metrics.views}</Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Bookmark size={18} color={colors.foreground} />
            <Text>{metrics.saves}</Text>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export const SmallListingCard = (
  item: SmallListingCardProps & ListingCardMetrics,
) => {
  const { colors } = useColorScheme();
  const router = useRouter();
  const localizedCost = useLocalizedCost(
    item.deal_type,
    item.budget,
    item.price,
  );

  const width =
    Platform.OS !== 'web' ? Dimensions.get('window').width - 32 : undefined;

  return (
    <Pressable
      onPress={() => router.push(`/listings/${item.id}`)}
      className="border-solid border-[1px] border-border p-4 flex-row gap-4 bg-accent items-start rounded w-[400px] h-[150px]"
      style={{ width }}
    >
      <AsyncImage
        source={{ uri: buildAssetUrl(item.user_created.avatar) }}
        className="w-8 h-8 rounded-full"
      />
      <View className="flex-col justify-between flex-1 h-full">
        <View className="flex-col gap-1">
          <Text className="text-lg font-semibold text-wrap">{item.title}</Text>
          <View className="flex-row justify-between gap-4 items-center">
            <Text className="!text-success">AED {localizedCost}</Text>
            <Text
              style={{ backgroundColor: opacity(colors.success, 0.1) }}
              className="text-success px-1 rounded"
            >
              {item.deal_type}
            </Text>
          </View>
          {item.tags && (
            <View className="flex-row gap-1 flex-wrap items-center">
              {item.tags.map((tag, i) => (
                <Text
                  className="text-info text-sm px-1 rounded"
                  style={{ backgroundColor: opacity(colors.info, 0.1) }}
                  key={i}
                >
                  {tag}
                </Text>
              ))}
            </View>
          )}
        </View>
        <Separator />
        <View className="flex-row justify-between items-center">
          <RenderMetrics metrics={{ saves: item.saves, views: item.views }} />
          <View className="ml-auto mr-0 flex-col gap-2">
            <Text className="text-xs text-subtext text-right">
              Posted {timeAgo.format(new Date(item.date_created))} in
            </Text>
            <LocationChip {...item.location} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const SmallListingCardSkeleton = () => {
  // Calculate width exactly like the original component
  const width =
    Platform.OS !== 'web' ? Dimensions.get('window').width - 32 : undefined;

  return (
    // Root View: Match Pressable styles precisely
    <View
      className="border-solid border-[1px] border-border p-4 flex-row gap-4 bg-accent items-start rounded w-[400px] h-[150px]"
      // Apply exact width style
      style={{ width }}
    >
      <Skeleton className="w-8 h-8 rounded-full" />

      <View className="flex-col justify-between flex-1 h-full">
        <View className="flex-col gap-1">
          <Skeleton className="h-6 w-5/6 rounded" />
          <View className="flex-row justify-between gap-4 items-center">
            <PriceSkeleton />
            <ListingTypeSkeleton />
          </View>
          <View className="flex-row gap-1 flex-wrap items-center mt-1">
            <Skeleton className="h-4 w-10 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </View>
        </View>
        <View className="h-[1px] w-full bg-border my-1" />
        <View className="flex-row justify-between items-center">
          <MetricsSkeleton />

          <View className="ml-auto mr-0 flex-col gap-1 items-end">
            <Skeleton className="h-3 w-28 rounded" />
            <LocationChipSkeleton className="mt-1" />
          </View>
        </View>
      </View>
    </View>
  );
};
