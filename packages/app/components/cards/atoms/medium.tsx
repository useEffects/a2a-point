import {
  Edit,
  Lock,
  MessageCircleMore,
  Share2,
  Trash,
} from 'app/components/icons';
import { UserChip, UserChipSkeleton } from 'app/components/user-chip';
import { LocationChip, LocationChipSkeleton } from 'app/components/utils/chips';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useLocalizedCost } from 'app/hooks/locale-string';
import { useRouter } from 'app/hooks/router';
import { getDMRoomId, shortString, timeAgo } from 'app/lib/helpers';
import { ListingCardMetrics } from 'app/lib/props';
import { Listing, Room, User } from 'app/lib/types';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import { Pressable, View } from 'react-native';
import { Button } from '../../ui/button';
import { Text } from '../../ui/text';
import { RenderMetrics } from './small';
import { Skeleton } from 'app/components/skeleton';
import Share from 'react-native-share';
import { colors } from 'react-native-keyboard-controller/lib/typescript/components/KeyboardToolbar/colors';
import { portfolioUrl } from 'app/lib/constants';

export type MediumListingCardProps = Pick<
  Listing,
  | 'id'
  | 'title'
  | 'budget'
  | 'deal_type'
  | 'description'
  | 'date_created'
  | 'price'
  | 'featured'
> & {
  user_created: Pick<
    User,
    'id' | 'avatar' | 'first_name' | 'last_name' | 'email' | 'plan'
  >;
} & { location: Pick<Room, 'id' | 'title' | 'avatar'> };

export const LockedChatButton = () => {
  const { colors } = useColorScheme();
  return (
    <Button
      variant={'base'}
      size={'none'}
      className="flex-row gap-1 items-center bg-muted border border-muted-foreground py-[2px] px-1 rounded"
    >
      <Text
        style={{ color: colors['muted-foreground'] }}
        className="text-muted-foreground text-sm"
      >
        chat
      </Text>
      <Lock size={14} color={colors['muted-foreground']} />
    </Button>
  );
};

export const MediumListingCard = (
  item: MediumListingCardProps & ListingCardMetrics,
) => {
  const { user } = userStore();
  const { authenticated } = directusStore();
  const localizedCost = useLocalizedCost(
    item.deal_type,
    item.budget,
    item.price,
  );
  const router = useRouter();
  const { colors } = useColorScheme();

  const shareListing = () => {
    const title = `Share the listing ${item.title} with other members in the A2A Point community!`;
    Share.open({
      title,
      message: `${title}\n\n`,
      url: `${portfolioUrl}/listings/${item.id}`,
      failOnCancel: false,
    });
  };

  return (
    <View className="w-full flex-col gap-2 min-h-[275px] justify-between">
      <View className="flex flex-wrap gap-4 flex-row items-center justify-between">
        <UserChip user={item.user_created} />
        {authenticated ? (
          user.id === item.user_created.id ? (
            <></>
          ) : (
            <Pressable
              onPress={() =>
                getDMRoomId([item.user_created.id, user.id]).then((id) =>
                  router.push(`/chat/${id}`),
                )
              }
            >
              <MessageCircleMore className="!text-foreground" />
            </Pressable>
          )
        ) : (
          <LockedChatButton />
        )}
      </View>
      <Pressable
        onPress={() => router.push(`/listings/${item.id}`)}
        className="items-start flex-col gap-2 w-full"
      >
        <Text className="!text-lg text-primary">{item.title}</Text>
        <View className="flex-row justify-between w-full">
          <LocationChip {...item.location} />
          {user.id === item.user_created.id && authenticated && (
            <View className="flex-row gap-4">
              <Button variant={'base'} size={'none'}>
                <Edit size={18} className="text-info" />
              </Button>
              <Button variant={'base'} size={'none'}>
                <Trash size={18} className="text-destructive" />
              </Button>
            </View>
          )}
        </View>
        <View className="flex-col gap-1 bg-accent rounded-2xl p-4 mt-2 w-full">
          <View className="flex-row justify-between">
            <Text className="text-success">AED {localizedCost}</Text>
            <Text className="text-primary capitalize">{item.deal_type}</Text>
          </View>
          <Text>{shortString(item.description, 200)}</Text>
        </View>
      </Pressable>
      <View className="m-0 p-0 px-2 flex-row justify-between w-full items-center">
        <View className="flex-row items-center gap-4">
          <RenderMetrics metrics={{ saves: item.saves, views: item.views }} />
          <Button
            onPress={shareListing}
            disabled={!authenticated}
            className="rounded-full"
            variant={'ghost'}
            size={'icon'}
          >
            <Share2 size={18} className="text-foreground" />
          </Button>
        </View>
        <Text className="text-xs text-subtext">
          {timeAgo.format(new Date(item.date_created))}
        </Text>
      </View>
    </View>
  );
};

// Re-usable skeleton for metrics
export const MetricsSkeleton = () => (
  <View className="flex-row gap-8">
    <Skeleton className="w-5 h-5 rounded-full" />
    <Skeleton className="w-5 h-5 rounded-full" />
  </View>
);

export const MediumListingCardSkeleton = () => {
  return (
    <View className="w-full flex-col gap-2 min-h-[275px] justify-between">
      <View className="flex flex-wrap gap-4 flex-row items-center justify-between">
        <UserChipSkeleton />
        <Skeleton className="w-8 h-8 rounded-full" />
      </View>

      <View className="items-start flex-col gap-2 w-full">
        <Skeleton className="h-6 w-3/5 rounded" />

        <View className="flex-row justify-between w-full items-center">
          <LocationChipSkeleton />
          <View className="flex-row gap-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-full" />
          </View>
        </View>

        <View className="flex-col gap-1 bg-accent rounded-2xl p-4 mt-2 w-full">
          <View className="flex-row justify-between mb-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
          </View>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded mt-1" />
        </View>
      </View>

      <View className="m-0 p-0 px-2 flex-row justify-between w-full items-center">
        <View className="flex-row items-center gap-8">
          <MetricsSkeleton />
          <Skeleton className="w-5 h-5 rounded-full" />
        </View>
        <Skeleton className="w-16 h-4 rounded-full" />
      </View>
    </View>
  );
};
