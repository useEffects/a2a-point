/* eslint-disable react/no-children-prop */
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { UserChip } from 'app/components/user-chip';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useUserDetails } from 'app/hooks/user-details';
import { buildAssetUrl, timeAgo } from 'app/lib/helpers';
import { NewsProps } from 'app/lib/types';
import { cn } from 'app/lib/utils';
import opacity from 'hex-color-opacity';
import { ReactNode } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import * as Linking from 'expo-linking';
import { portfolioUrl } from 'app/lib/constants';
import { Link } from 'expo-router';
import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';

export const NewsCard = ({
  isFirst = false,
  ...news
}: NewsProps & { isFirst?: boolean }) => {
  const isNative = Platform.OS !== 'web';
  const windowWidth = Dimensions.get('window').width;
  const { colors } = useColorScheme();
  const Component = isNative
    ? ({ children }: { children: ReactNode }) => (
        <Button
          children={children}
          variant={'base'}
          size={'none'}
          onPress={() => Linking.openURL(`${portfolioUrl}/news/${news.id}`)}
        />
      )
    : ({ children }: { children: ReactNode }) => (
        <View children={children} className="flex-col" />
      );

  return (
    <Component>
      <View
        style={{ width: isNative ? windowWidth * 0.5 : undefined }}
        className={cn(isFirst ? 'flex-row' : 'flex-col', !isNative && 'h-full')}
      >
        <View className={cn(isFirst ? 'w-1/2' : 'w-full')}>
          <AsyncImage
            className={cn(
              isFirst ? 'h-[600px]' : isNative ? 'h-[200px]' : 'h-[300px]',
              'rounded-tl-xl rounded-tr-xl',
            )}
            source={{ uri: buildAssetUrl(news.cover_image) }}
          />
        </View>
        <View
          className={cn(
            'bg-accent p-4 rounded-bl-xl rounded-br-xl',
            isFirst
              ? 'w-1/2 self-center bg-transparent max-w-sm mx-auto'
              : 'w-full native:h-40',
            'p-4 flex-col items-start',
            isNative ? 'gap-1' : 'gap-4 flex-grow',
          )}
        >
          <View className="flex-row justify-between w-full">
            <Text className="text-info">{news.read_time}</Text>
            <Text className="text-subtext text-sm">
              {timeAgo.format(new Date(news.date_created))}
            </Text>
          </View>
          <Text className="text-lg font-medium">{news.title}</Text>
          {!isNative && (
            <View className="flex-col gap-4 flex-grow justify-between">
              <View className="flex-col gap-4">
                <View className="flex-row flex-wrap gap-4">
                  {news.categories?.map((category, i) => (
                    <View
                      style={{ backgroundColor: opacity(colors.primary, 0.1) }}
                      className="rounded px-2 py-1 text-sm"
                      key={i}
                    >
                      <Text className="text-primary">
                        {category.news_categories_id.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {news.tags?.map((tag, i) => (
                    <View
                      className="border-info border rounded-xl py-1 px-2 text-sm"
                      key={i}
                    >
                      <Text className="text-info text-sm">{tag}</Text>
                    </View>
                  ))}
                </View>
                <Text className="text-subtext">{news.description}</Text>
              </View>
              <Link href={`/news/${news.id}`}>
                <Button>
                  <Text>Read More</Text>
                </Button>
              </Link>
            </View>
          )}
        </View>
      </View>
    </Component>
  );
};

export const NewsCardSkeleton = () => {
  const isNative = Platform.OS !== 'web';
  const windowWidth = Dimensions.get('window').width;

  // Define dimensions based on typical non-'isFirst' card
  const cardWidth = isNative ? windowWidth * 0.5 : undefined; // Mimic native width style
  const imageHeight = isNative ? 'h-[200px]' : 'h-[300px]'; // Common non-'isFirst' heights

  // Define gaps based on platform for the content area
  const contentGap = isNative ? 'gap-1' : 'gap-4';
  // Using flex-grow like web version for better structure handling
  const contentFlex = isNative ? 'min-h-[160px]' : 'flex-grow'; // h-40 = 160px, or use flex-grow

  return (
    <View
      style={{ width: cardWidth }}
      className={cn('flex-col', !isNative && 'h-full')} 
    >
      <Skeleton
        className={cn(
          'w-full',
          imageHeight, 
          'rounded-tl-xl rounded-tr-xl', 
        )}
      />

      <View
        className={cn(
          'bg-accent p-4 rounded-bl-xl rounded-br-xl', 
          'w-full', 
          'flex-col items-start', 
          contentGap, 
          contentFlex,
          'justify-between', 
        )}
      >
        <View className="w-full flex-col gap-2">
          <View className="flex-row justify-between w-full items-center">
            <Skeleton className="h-4 w-16 rounded" /> 
            <Skeleton className="h-3 w-20 rounded" /> 
          </View>
          <Skeleton className="h-6 w-5/6 rounded" />
        </View>
        <View
          className={cn(
            'w-full flex-col',
            contentGap === 'gap-4' ? 'gap-4' : 'gap-2',
          )}
        >
          <View className="flex-row flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Skeleton className="h-5 w-12 rounded-xl" />
            <Skeleton className="h-5 w-14 rounded-xl" />
            <Skeleton className="h-5 w-10 rounded-xl" />
          </View>
          <View className="flex-col gap-1 mt-1">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
          </View>
        </View>
        <Skeleton className="h-10 w-28 rounded" />
      </View>
    </View>
  );
};
