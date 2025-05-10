'use client';

import { HorizontalFlatList } from '@idiosync/horizontal-flatlist';
import { HorizontalFlatListProps } from '@idiosync/horizontal-flatlist/dist/horizontal-flat-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowUpRight, Share2 } from 'app/components/icons';
import { Button, ButtonProps } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { ViewAllButton } from 'app/components/utils/common-ui';
import { FlatList } from 'app/components/utils/virtual-lists';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl, shortString } from 'app/lib/helpers';
import {
  getListingsCountForLocation,
  getMembersCountForLocation,
  renderCardsQuery,
} from 'app/lib/misc/queries';
import {
  LocationCardMetrics,
  MediumLocationCardProps,
  mediumLocationFields,
  SmallLocationCardProps,
} from 'app/lib/props';
import { User } from 'app/lib/types';
import { directusStore } from 'app/store/directus';
import opacity from 'hex-color-opacity';
import { uniqBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FlatListProps, Image, Platform, Pressable, View } from 'react-native';
import { BottomLoader } from './listings';
import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';
import Share from 'react-native-share';
import { portfolioUrl } from 'app/lib/constants';

export const SmallLocationCard = (item: SmallLocationCardProps) => {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    getListingsCountForLocation(item.id).then(setCount);
  }, []);

  return (
    <View className="flex-col gap-4 items-center">
      <Pressable
        className="relative h-16 w-16 rounded-full"
        onPress={() => router.push(`/locations/${item.id}`)}
      >
        <AsyncImage
          source={{ uri: buildAssetUrl(item.avatar!) }}
          className="w-16 h-16 rounded-full"
        />
        <View className="absolute bg-accent flex-row justify-center items-center rounded-full w-8 h-8 left-auto -right-2 top-auto -bottom-2 border-solid border-2 border-background">
          <Text className="!text-xs !text-accent-foreground">{count}</Text>
        </View>
      </Pressable>
      <Text className="text-sm text-center">
        {shortString(item.title!, 10)}
      </Text>
    </View>
  );
};

export const SmallLocationCards = ({
  flatListProps,
  data,
}: {
  flatListProps?: Omit<
    HorizontalFlatListProps<SmallLocationCardProps>,
    'data' | 'renderItem'
  >;
  data: SmallLocationCardProps[];
}) => {
  const { rest } = directusStore();
  const router = useRouter();

  return (
    <HorizontalFlatList
      overScrollMode="never"
      data={data}
      renderItem={({ item }) => <SmallLocationCard {...item} />}
      ItemSeparatorComponent={() => <View className="w-4 h-4" />}
      numRows={2}
      keyExtractor={(item) => item.id}
      ListFooterComponent={
        <ViewAllButton
          horizontal={true}
          button={(props: ButtonProps) => (
            <Button onPress={() => router.push('/locations')} {...props} />
          )}
        />
      }
      ListHeaderComponent={() => <View className="w-4 h-4" />}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...flatListProps}
    />
  );
};

export const MediumLocationCard = (
  item: MediumLocationCardProps & LocationCardMetrics,
) => {
  const { authenticated } = directusStore();
  const router = useRouter();

  const finalMembers = item.members.filter(
    (member) => member.directus_users_id,
  );

  const shareLocation = () => {
    Share.open({
      title: `${item.title}\n`,
      message: `Discover listings in ${item.title}!\n\nView full details on A2A Point.`,
      url: `${portfolioUrl}/agents/${item.id}`,
    });
  };

  return (
    <Pressable
      onPress={() => router.push(`/locations/${item.id}`)}
      className="flex-row rounded-xl bg-accent justify-start items-start w-full aspect-video"
    >
      <AsyncImage
        source={{ uri: buildAssetUrl(item.avatar) }}
        className="w-1/2 h-full rounded-tl-xl rounded-bl-xl"
        resizeMode="cover"
      />
      <View className="h-full flex-col justify-start gap-2 p-4 w-1/2">
        <Text className="font-medium">{item.title}</Text>
        <View className="flex-row gap-2 items-center">
          <Button
            onPress={shareLocation}
            disabled={!authenticated}
            className="rounded-full"
            variant={'ghost'}
            size={'icon'}
          >
            <Share2 size={18} className="text-foreground" />
          </Button>
          <Text className="text-success">
            {item.listingsCount} leads available
          </Text>
        </View>
        <MembersList
          locationId={item.id}
          members={finalMembers.slice(0, 5)}
          total={item.membersCount}
        />
        <Button
          onPress={() => router.push(`/chat/${item.id}`)}
          disabled={!authenticated}
          className="mt-auto mb-0 flex-row"
        >
          <View className="flex-row">
            <Text>Group chat</Text>
            <ArrowUpRight size={18} className="text-primary-foreground" />
          </View>
        </Button>
      </View>
    </Pressable>
  );
};

export const MediumLocationCardSkeleton = () => {
  return (
    <View className="flex-row rounded-xl bg-accent justify-start items-start w-full aspect-video overflow-hidden">
      <Skeleton className="w-1/2 h-full rounded-none" />
      <View className="h-full flex-col justify-between p-4 w-1/2">
        <View className="flex-col gap-2">
          <Skeleton className="h-5 w-5/6 mb-2 rounded" />
          <View className="flex-row gap-2 items-center">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </View>
          <View className="flex-row items-center mb-3">
            <Skeleton className="h-12 w-12 rounded-full border-2 border-accent" />
            <Skeleton className="h-12 w-12 rounded-full border-2 border-accent -ml-2" />
            <Skeleton className="h-12 w-12 rounded-full border-2 border-accent -ml-2" />
            <Skeleton className="h-12 w-12 rounded-full border-2 border-accent -ml-2" />
          </View>
        </View>

        <View>
          <Skeleton className="h-10 w-full rounded-md" />
        </View>
      </View>
    </View>
  );
};

export const MembersList = ({
  members,
  total,
  locationId,
}: {
  members: {
    directus_users_id: Pick<User, 'avatar'>;
  }[];
  total: number;
  locationId: string;
}) => {
  const { colors } = useColorScheme();
  const router = useRouter();

  const faces = members.map((member) => ({
    imageUrl: buildAssetUrl(member.directus_users_id.avatar),
  }));

  return Number(total) ? (
    <View className="flex-row relative self-start">
      {faces.map((face, i) => (
        <AsyncImage
          key={i}
          className="w-12 h-12 -mr-4 rounded-full border-background  border-1 border"
          source={{ uri: face.imageUrl }}
        />
      ))}
      <Pressable
        className="absolute -right-4 w-12 h-12 flex-col rounded-full justify-center items-center"
        style={{
          backgroundColor: opacity(colors.info, 0.75),
          zIndex: 10,
          elevation: 10,
        }}
      >
        <Text className="text-info-foreground !text-xs">{total}+</Text>
        {/* <ArrowUpRight className="text-info-foreground" size={12} /> */}
      </Pressable>
    </View>
  ) : (
    <Text className="text-warning">No members yet</Text>
  );
};

export const SmallLocationCardSkeleton = () => {
  return (
    <View className="flex-col relative gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="w-16 h-4" />
      <View className="bg-background absolute left-auto -right-2 top-auto bottom-8 w-8 h-8 rounded-full">
        <Skeleton className="border-2 border-background border-solid rounded-full w-full h-full" />
      </View>
    </View>
  );
};
