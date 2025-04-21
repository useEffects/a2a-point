import { useQuery } from '@tanstack/react-query';
import {
  AtSign,
  Award,
  Check,
  MessageCircleMore,
  Phone,
  Star,
} from 'app/components/icons';
import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import {
  buildAssetUrl,
  getDMRoomId,
  isUserPro,
  isUserVerified,
  shortString,
  timeAgo,
} from 'app/lib/helpers';
import {
  getFeedbacksCountForUser,
  getListingsCountForUser,
} from 'app/lib/misc/queries';
import {
  MediumUsersCardProps,
  SmallUsersCardProps,
  UsersCardMetrics,
} from 'app/lib/props';
import { cn } from 'app/lib/utils';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import * as Linking from 'expo-linking';
import opacity from 'hex-color-opacity';
import { Image, Pressable, View } from 'react-native';
import { CompanyChip } from './company';
import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';
import { LocationChipSkeleton } from 'app/components/utils/chips';

export const SmallUsersCard = (item: SmallUsersCardProps) => {
  const { colors } = useColorScheme();
  const router = useRouter();
  const { data: ratingsCount } = useQuery({
    queryKey: ['ratingsCount', item.id],
    queryFn: async () => await getFeedbacksCountForUser(item.id),
  });
  const { data: listingsCount } = useQuery({
    queryKey: ['listingsCount', item.id],
    queryFn: async () => await getListingsCountForUser(item.id),
  });

  return (
    <Pressable
      onPress={() => router.push(`/agents/${item.id}`)}
      className={cn('rounded-xl relative w-48 h-[250px]')}
    >
      <View className="w-full h-10 flex-col justify-center items-start">
        <View
          className="flex-row items-center rounded p-1"
          style={{ backgroundColor: opacity(colors.primary, 0.1) }}
        >
          <Award size={12} color={colors.primary} className="text-primary" />
          <Text className="text-primary text-xs">Pro</Text>
        </View>
      </View>
      <View className="h-8 w-full bg-accent rounded-tl-xl rounded-tr-xl" />
      <AsyncImage
        className="rounded-full w-20 h-20 absolute top-0 z-10 left-14 border border-background border-4"
        source={{ uri: buildAssetUrl(item.avatar) }}
      />
      <View className="p-4 bg-accent flex-col justify-between rounded-bl-xl rounded-br-xl h-[175px] w-full flex-1">
        <Text className="font-medium">
          {item.first_name} {item.last_name}
        </Text>
        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-1">
            <Star size={18} className="text-success" />
            <Text className="text-success">{item.computed_rating}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-subtext">{ratingsCount}</Text>
            <Text className="text-subtext">ratings</Text>
          </View>
        </View>
        {item.company && <CompanyChip {...item.company} />}
        <Separator />
        <View className="flex-row gap-1 items-center">
          <Text className="text-primary">{listingsCount}</Text>
          <Text className="text-subtext">listings</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const MediumUsersCard = (
  item: MediumUsersCardProps & UsersCardMetrics,
) => {
  const { user } = userStore();
  const { authenticated } = directusStore();
  const { colors } = useColorScheme();
  const shouldShowEllipsis = item.tags?.length ? item.tags.length > 3 : false;
  const router = useRouter();

  const handleChatRedirect = async (userId: string) => {
    const dmRoomId = await getDMRoomId([user.id, userId]);
    router.push(`/chat/${dmRoomId}`);
  };

  return (
    <Pressable
      onPress={() => router.push(`/agents/${item.id}`)}
      className="flex-col gap-4"
    >
      <View className="w-full flex-row w-full justify-start min-h-[100px]">
        <View className="w-1/2 rounded-tl-xl h-full">
          <View className="relative flex-col items-start w-full h-16">
            <View className="h-8 bg-background w-full pl-20 flex-row items-center gap-1">
              <Text className="text-primary">{item.listingsCount}</Text>
              <Text className="text-subtext">leads</Text>
            </View>
            <View className="absolute" style={{ elevation: 100, zIndex: 100 }}>
              <AsyncImage
                className="w-16 h-16 rounded-full border border-background border-1"
                source={{ uri: buildAssetUrl(item.avatar) }}
              />
            </View>
            <View className="bg-accent w-full pl-20 flex-row items-center justify-between gap-4 pr-4 rounded-tl-xl flex-grow">
              {item.computed_rating ? (
                <View className="flex-row gap-1 items-center">
                  <Star
                    size={18}
                    color={colors.success}
                    className="text-success"
                  />
                  <Text className="text-success">{item.computed_rating}</Text>
                </View>
              ) : (
                <></>
              )}
              <View className="flex-row gap-1 items-center">
                <Text className="text-sm text-subtext">Ratings</Text>
                <Text className="text-sm text-subtext">
                  {item.ratingsCount}
                </Text>
              </View>
            </View>
          </View>
          <View className="w-full flex-col gap-4 p-4 bg-accent rounded-bl-xl flex-1">
            <View className="flex-col gap-2">
              <Text className="font-medium">
                {item.first_name} {item.last_name}
              </Text>
            </View>
          </View>
        </View>
        <View className="w-1/2 bg-background flex-col h-full">
          <View className="h-8 w-full flex-row justify-end items-center gap-1">
            {isUserPro(item.plan) && (
              <View className="bg-primary/10 text-primary text-sm py-[2px] px-1 rounded flex-row gap-1 items-center">
                <Award
                  size={12}
                  color={colors.primary}
                  className="text-primary"
                />
                <Text className="text-sm text-primary">Pro</Text>
              </View>
            )}
            {item.document && isUserVerified(item.document) && (
              <View className="bg-success/10 text-success text-sm py-[2px] px-1 rounded flex-row gap-1 items-center">
                <Check
                  size={12}
                  color={colors.success}
                  className="text-success"
                />
                <Text className="text-sm text-success">Verified</Text>
              </View>
            )}
          </View>
          <View className="p-4 pt-2 flex-1 flex-col justify-evenly gap-2 items-start rounded-tr-xl rounded-br-xl bg-accent">
            {item.last_access ? (
              <Text className="text-sm text-subtext">
                last seen {timeAgo.format(new Date(item.last_access))}
              </Text>
            ) : (
              <></>
            )}
            <View className="flex-row gap-2 items-center flex-wrap">
              {item.tags?.slice(0, 3)?.map((tag, i) => (
                <Text
                  key={i}
                  className="text-sm text-info bg-info/10 px-1 rounded"
                >
                  {tag}
                </Text>
              ))}
              {shouldShowEllipsis && (
                <Text className="text-sm text-subtext">...</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      {item.description && (
        <Text className="text-subtext">
          {shortString(item.description, 200)}
        </Text>
      )}
      <View className="w-full flex-row gap-4">
        {item.company && (
          <CompanyChip
            avatar={item.company.avatar}
            title={item.company.title}
            id={item.company.title}
          />
        )}
        <View className="flex-row gap-4 ml-auto mr-0">
          {user.id !== item.id && (
            <Button
              onPress={() => handleChatRedirect(item.id)}
              disabled={!authenticated}
              className="rounded-full"
              variant={'ghost'}
              size={'icon'}
            >
              <MessageCircleMore size={18} className="text-foreground" />
            </Button>
          )}
          {[
            {
              icon: Phone,
              href: authenticated ? `tel:${item.phone}` : 'No peeking!',
              show: item.phone,
            },
            {
              icon: AtSign,
              href: authenticated ? `mailto:${item.email}` : 'No peeking!',
              show: item.email,
            },
          ]
            .filter((i) => Boolean(i.show))
            .map(({ icon, href }, i) => {
              const Icon = icon;
              return (
                <Button
                  onPress={() => Linking.openURL(href)}
                  key={i}
                  variant={'ghost'}
                  className="rounded-full"
                  size={'icon'}
                  disabled={!authenticated}
                >
                  <Icon
                    color={colors.foreground}
                    size={18}
                    className="text-foreground"
                  />
                </Button>
              );
            })}
        </View>
      </View>
    </Pressable>
  );
};

// Placeholder for the chip skeleton, adjust if you have a specific one
const ChipSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn('h-6 w-24 rounded-full', className)} />
);

export const SmallUsersCardSkeleton = () => {
  return (
    <View className="w-48 h-[250px] rounded-xl relative bg-accent">
      <View className="h-10 w-full px-1 pt-1 flex-col items-start">
        <Skeleton className="h-5 w-10 rounded" />
      </View>
      <View className="h-8 w-full bg-accent rounded-tl-xl rounded-tr-xl absolute top-2 left-0 right-0" />

      <Skeleton className="rounded-full w-20 h-20 absolute top-0 z-10 left-14 border border-background border-4" />

      <View className="absolute top-10 left-0 right-0 bottom-0 p-4 bg-accent flex-col justify-between rounded-bl-xl rounded-br-xl border-t border-transparent">
        <View className="mt-10">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-6" />
            </View>
            <View className="flex-row items-center gap-1">
              <Skeleton className="h-4 w-5" />
              <Skeleton className="h-4 w-10" />
            </View>
          </View>
          <ChipSkeleton className="w-28 mb-2" />
        </View>

        <View>
          <Skeleton className="h-[1px] w-full my-2 bg-border" />
          <View className="flex-row gap-1 items-center">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-12" />
          </View>
        </View>
      </View>
    </View>
  );
};

export const MediumUsersCardSkeleton = () => {
  return (
    <View className="flex-col gap-4">
      <View className="w-full flex-row justify-start min-h-[100px]">
        <View className="w-1/2 h-full">
          <View className="relative flex-col items-start w-full h-16">
            <View className="h-8 bg-background w-full pl-20 flex-row items-center gap-1">
              <Skeleton className="h-4 w-12 rounded" />
            </View>
            <View className="absolute" style={{ elevation: 100, zIndex: 100 }}>
              <Skeleton className="w-16 h-16 rounded-full border border-background border-1" />
            </View>
            <View className="bg-accent w-full pl-20 flex-row items-center justify-between gap-4 pr-4 rounded-tl-xl flex-grow">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </View>
          </View>
          <View className="w-full flex-col gap-2 p-4 bg-accent rounded-bl-xl flex-1 justify-center">
            <Skeleton className="h-5 w-3/4 rounded" />
          </View>
        </View>

        <View className="w-1/2 bg-background flex-col h-full">
          <View className="h-8 w-full flex-row justify-end items-center gap-2 pr-2">
            <Skeleton className="h-5 w-10 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
          </View>
          <View className="p-4 pt-2 flex-1 flex-col justify-evenly gap-2 items-start rounded-tr-xl rounded-br-xl bg-accent">
            <Skeleton className="h-4 w-1/2 rounded" />
            <View className="flex-row gap-2 items-center flex-wrap">
              <Skeleton className="h-5 w-10 rounded" />
              <Skeleton className="h-5 w-12 rounded" />
              <Skeleton className="h-5 w-8 rounded" />
            </View>
          </View>
        </View>
      </View>

      <View className="flex-col gap-1 mt-1">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </View>

      <View className="w-full flex-row gap-4 items-center mt-2">
        <LocationChipSkeleton className="w-32" />
        <View className="flex-row gap-2 ml-auto mr-0">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </View>
      </View>
    </View>
  );
};
