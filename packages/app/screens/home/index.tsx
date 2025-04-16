import { readItems } from '@directus/sdk';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { NewsCard, NewsCardSkeleton } from 'app/components/cards/atoms/news';
import {
  PhotoListingCard,
  PhotoListingCardSkeleton,
  PhotoListingProps,
} from 'app/components/cards/atoms/photo';
import {
  SmallListingCard,
  SmallListingCardProps,
  SmallListingCardSkeleton,
} from 'app/components/cards/atoms/small';
import {
  bodies,
  CommonFilters,
  commonFilters,
  RenderListings,
} from 'app/components/cards/molecules/listings';
import {
  SmallLocationCard,
  SmallLocationCards,
  SmallLocationCardSkeleton,
} from 'app/components/cards/molecules/locations';
import {
  RenderUsers,
  Mode as UsersRenderMode,
} from 'app/components/cards/molecules/users';
import { useSmallLocationsQuery } from 'app/components/cards/utils/locations';
import { useSmallUsersQuery } from 'app/components/cards/utils/users';
import { CompanyStats } from 'app/components/company-stats';
import { Header, HeaderTitle } from 'app/components/header';
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  MoveRight,
} from 'app/components/icons';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { ViewAllButton } from 'app/components/utils/common-ui';
import { FlatList } from 'app/components/utils/virtual-lists';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { directusUrl, portfolioUrl } from 'app/lib/constants';
import {
  getCompaniesWithAgents,
  getListingMetrics,
  getListingsCount,
  getLocationsCount,
  getUsersCount,
  renderCardsQuery,
} from 'app/lib/misc/queries';
import {
  ListingCardMetrics,
  photoListingsFields,
  smallListingsFields,
  SmallLocationCardProps,
  SmallUsersCardProps,
  UsersCardMetrics,
} from 'app/lib/props';
import { NewsProps } from 'app/lib/types';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import * as Linking from 'expo-linking';
import opacity from 'hex-color-opacity';
import { View } from 'react-native';
import { categoryTiles, FilterKeys } from '../listings';
import { Button } from 'app/components/ui/button';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from 'app/context/auth';
import { getTimeofDay } from 'app/lib/helpers';
import { keycloakStore } from 'app/store/keycloak';
import { lowerCase, startCase } from 'lodash';
import { ActivityScreen } from '../activity';
import Logo from 'app/components/svg/logo';
import { TypeAnimation } from 'react-native-type-animation';
import InfiniteList from 'app/components/infinite';
import {
  newsQuery,
  photoHistoryListingsQuery,
  photoListingsQuery,
} from './queries';
import { premiumListingsSmallQuery } from '../listings/queries';
import { smallLocationsCardQuery } from '../locations/queries';
import { smallUsersQuery } from '../agents/queries';
import {
  SmallUsersCardSkeleton,
  SmallUsersCard,
} from 'app/components/cards/atoms/users';

export function HomeScreen() {
  const { authenticated } = directusStore();
  const { user } = userStore();
  const { colors } = useColorScheme();
  const { rest } = directusStore();
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated && !(user.first_name || user.last_name)) {
      logout();
    }
  }, [authenticated, user.first_name, user.last_name]);

  const smallLocationsQueryOptions = smallLocationsCardQuery({
    limit: 16,
  });
  const smallUsersQueryOptions = smallUsersQuery();
  const premiumListingsSmallQueryOptions = premiumListingsSmallQuery();
  const newsQueryOptions = newsQuery();

  return (
    <View className="flex-grow flex-col gap-8 py-8">
      <Greeting />

      {/* At your Glance */}
      <View className="px-4 flex-col gap-4">
        <SeparatorText hideLeft>
          <Text className="font-medium">At your Glance</Text>
        </SeparatorText>
        <CompanyStats className="gap-4" />
      </View>

      {/* Premium Listings CTA */}
      <View className="px-4">
        <SeparatorText hideRight>
          <Button
            onPress={() =>
              router.push(
                `/listings?filters=${JSON.stringify([
                  {
                    [FilterKeys.Premium]: CommonFilters.Premium,
                  },
                ])}`,
              )
            }
            variant="base"
            size="none"
            className="flex-row gap-1 items-center w-60 ml-auto mr-0"
          >
            <Text className="text-right text-subtext">
              Premium listings curated by {'\n'} A2A Point
            </Text>
            <ArrowUpRight size={24} className="text-info" color={colors.info} />
          </Button>
        </SeparatorText>
      </View>

      {/* Premium Listings */}
      <InfiniteList<SmallListingCardProps & ListingCardMetrics>
        flatListProps={{
          horizontal: true,
          ListHeaderComponent: () => <View className="w-4 h-4" />,
        }}
        component={SmallListingCard}
        skeletonComponent={SmallListingCardSkeleton}
        infiniteQueryOptions={premiumListingsSmallQueryOptions}
        viewAllLink="/"
      />

      {/* Popular Locations */}
      <View className="flex-col gap-4 bg-card p-4">
        <SeparatorText hideLeft>
          <Text className="font-medium">Browse popular locations</Text>
        </SeparatorText>
        <InfiniteList<SmallLocationCardProps>
          component={SmallLocationCard}
          skeletonComponent={SmallLocationCardSkeleton}
          infiniteQueryOptions={smallLocationsQueryOptions}
          flatListProps={{
            horizontal: true,
            ItemSeparatorComponent: () => <View className="w-4 h-4" />,
          }}
          viewAllLink="/locations"
          numRows={2}
          skeletonCount={16}
        />
      </View>

      {/* Top Rated Agents */}
      <View className="flex-col gap-4 px-4">
        <SeparatorText hideLeft>
          <Text className="font-medium">Top rated agents</Text>
        </SeparatorText>
        <InfiniteList<SmallUsersCardProps & UsersCardMetrics>
          component={SmallUsersCard}
          skeletonComponent={SmallUsersCardSkeleton}
          flatListProps={{
            horizontal: true,
            ItemSeparatorComponent: () => <View className="w-4 h-4" />,
          }}
          infiniteQueryOptions={smallUsersQueryOptions}
          viewAllLink="/agents"
        />
      </View>

      {/* News & Feeds */}
      <View className="flex-col gap-4 px-4">
        <SeparatorText hideLeft>
          <Text className="font-medium">News and feeds</Text>
        </SeparatorText>
        <InfiniteList<NewsProps>
          component={NewsCard}
          infiniteQueryOptions={newsQueryOptions}
          skeletonComponent={NewsCardSkeleton}
          flatListProps={{
            horizontal: true,
            ItemSeparatorComponent: () => <View className="w-4 h-4" />,
          }}
          viewAllLink="https://a2apoint.com/news"
        />
      </View>

      {/* Quick Links */}
      <View className="flex-col gap-4 px-4">
        <SeparatorText hideLeft>
          <Text className="font-medium">Quick links</Text>
        </SeparatorText>
        <View className="flex-row justify-between">
          {externalLinks.map(({ label, href }, index) => (
            <Button
              key={index}
              variant="base"
              size="none"
              style={{ backgroundColor: opacity(colors.info, 0.1) }}
              className="flex-row gap-1 py-1 px-2 rounded"
              onPress={() => Linking.openURL(href)}
            >
              <Text className="text-info">{label}</Text>
              <ExternalLink
                size={18}
                className="text-info"
                color={colors.info}
              />
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}

export const HomeScreenHeader = () => {
  return (
    <Header>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full bg-light p-1 border-border">
          <Logo height={28} width={28} />
        </View>
        <HeaderTitle>A2A Point</HeaderTitle>
      </View>
    </Header>
  );
};

const Greeting = () => {
  const { user } = userStore();
  const { authenticated } = directusStore();
  const [timeOfDay] = useState(
    authenticated ? startCase(lowerCase(getTimeofDay())) : null,
  );
  const router = useRouter();
  const { colors } = useColorScheme();

  const queryOptions = authenticated
    ? photoHistoryListingsQuery()
    : photoListingsQuery();

  return (
    <View className="flex-col gap-8">
      <View className="px-4 flex-col gap-2">
        <Text className="font-bold text-3xl">
          {authenticated
            ? `Good ${timeOfDay}, ${user.first_name}`
            : 'Welcome to A2A Point'}
        </Text>
        <Text className="text-subtext font-medium">
          {' '}
          {authenticated
            ? 'What are we looking at Today?'
            : 'One stop for all Agents!'}{' '}
        </Text>
        <View className="flex-row gap-2">
          {categoryTiles.map((cat, i) => (
            <View
              onClick={() =>
                router.push(
                  `/listings/?filter=${JSON.stringify([
                    {
                      [cat.key]: cat.value,
                    },
                  ])}`,
                )
              }
              key={i}
            >
              <Button variant={'secondary'} size={'sm'}>
                <Text>{cat.title}</Text>
              </Button>
            </View>
          ))}
        </View>
      </View>

      <View className="flex-col justify-start gap-4 px-4 bg-card py-8">
        <SeparatorText hideLeft>
          <View className="flex-row items-center gap-2">
            {authenticated ? (
              <>
                <Clock color={colors.foreground} />
                <Text className="font-medium">Continue your search</Text>
              </>
            ) : (
              <>
                <Text className="font-medium">View popular listings</Text>
              </>
            )}
          </View>
        </SeparatorText>
        <InfiniteList<PhotoListingProps>
          component={PhotoListingCard}
          infiniteQueryOptions={queryOptions}
          skeletonComponent={PhotoListingCardSkeleton}
          flatListProps={{
            horizontal: true,
            showsHorizontalScrollIndicator: false,
            ItemSeparatorComponent: () => <View className="w-4 h-4" />,
          }}
          viewAllLink="/listings"
        />
      </View>
    </View>
  );
};

const externalLinks = [
  {
    label: 'Website',
    href: portfolioUrl,
  },
  {
    label: 'Dashboard',
    href: directusUrl,
  },
  {
    label: 'Courses',
    href: `${directusUrl}/courses`,
  },
  {
    label: 'News',
    href: `${directusUrl}/news`,
  },
];
