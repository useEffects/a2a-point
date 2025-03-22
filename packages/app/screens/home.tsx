import { readItems } from '@directus/sdk';
import { useQuery } from '@tanstack/react-query';
import { NewsCard } from 'app/components/cards/atoms/news';
import { PhotoListingProps } from 'app/components/cards/atoms/photo';
import { SmallListingCardProps } from 'app/components/cards/atoms/small';
import {
  bodies,
  CommonFilters,
  commonFilters,
  RenderListings,
} from 'app/components/cards/molecules/listings';
import { SmallLocationCards } from 'app/components/cards/molecules/locations';
import {
  RenderUsers,
  Mode as UsersRenderMode,
} from 'app/components/cards/molecules/users';
import { useSmallLocationsQuery } from 'app/components/cards/utils/locations';
import { useSmallUsersQuery } from 'app/components/cards/utils/users';
import { CompanyStats } from 'app/components/company-stats';
import { Header, HeaderTitle } from 'app/components/header';
import { ArrowUpRight, ExternalLink } from 'app/components/icons';
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
  SmallUsersCardProps,
  UsersCardMetrics,
} from 'app/lib/props';
import { News } from 'app/lib/types';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import * as Linking from 'expo-linking';
import opacity from 'hex-color-opacity';
import { View } from 'react-native';
import { FilterKeys } from './listings';
import { Button } from 'app/components/ui/button';
import { useContext, useEffect } from 'react';
import { AuthContext } from 'app/context/auth';

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

  const { data: news } = useQuery<News[]>({
    queryKey: ['Fetch news'],
    queryFn: async () =>
      (await rest.request(
        readItems('news', {
          limit: 10,
        }),
      )) as News[],
    initialData: [],
  });

  const { data: users } = useSmallUsersQuery();
  const { data: locations } = useSmallLocationsQuery();

  const { data: counts } = useQuery<{
    listingsCount: number;
    usersCount: number;
    locationsCount: number;
    companiesCount: number;
  }>({
    queryKey: ['Fetch counts'],
    queryFn: async () =>
      await Promise.all([
        getListingsCount(),
        getUsersCount(),
        getLocationsCount(),
        getCompaniesWithAgents(),
      ]).then(
        ([listingsCount, usersCount, locationsCount, companiesCount]) => ({
          listingsCount,
          usersCount,
          locationsCount,
          companiesCount,
        }),
      ),
    initialData: {
      listingsCount: 0,
      usersCount: 0,
      locationsCount: 0,
      companiesCount: 0,
    },
  });

  const { data: photoListingsInitialData } = useQuery({
    queryKey: ['Fetch photo listings'],
    queryFn: async () =>
      await renderCardsQuery<PhotoListingProps>({
        collection: 'listings',
        fields: photoListingsFields,
        filter: commonFilters[CommonFilters.Photo](),
        limit: 5,
      }).then((res) =>
        Promise.all(
          res.map(async (listing) => {
            const metrics = await getListingMetrics(listing.id);
            return { ...metrics, ...listing };
          }),
        ),
      ),
    initialData: [],
  });

  const { data: premiumSmallListingsInitialData } = useQuery({
    queryKey: ['Fetch small listings'],
    queryFn: async () =>
      await renderCardsQuery<SmallListingCardProps>({
        collection: 'listings',
        fields: smallListingsFields,
        filter: commonFilters[CommonFilters.Premium](),
        limit: 5,
      }).then((res) =>
        Promise.all(
          res.map(async (listing) => {
            const metrics = await getListingMetrics(listing.id);
            return { ...metrics, ...listing };
          }),
        ),
      ),
    initialData: [],
  });

  return (
    <View className="flex-grow flex-col gap-8 pb-8 pt-8">
      <Text className="text-2xl font-bold text-wrap px-4">
        {authenticated
          ? `Welcome back ${user.first_name} ${user.last_name}`
          : 'The one stop for all agents'}
      </Text>
      <RenderListings<PhotoListingProps & ListingCardMetrics>
        render={bodies.photo}
        initialData={photoListingsInitialData}
        filter={commonFilters[CommonFilters.Photo]()}
        flatListProps={{
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          ListHeaderComponent: () => <View className="w-4 h-4" />,
        }}
      />
      <CompanyStats counts={counts} className="gap-12 px-4" />
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
          variant={'base'}
          size={'none'}
          className="flex-row px-4 gap-1 items-center w-60 ml-auto mr-0"
        >
          <Text className="text-right text-subtext">
            Premium listings curated by A2APoint
          </Text>
          <ArrowUpRight size={24} className="text-info" />
        </Button>
      </SeparatorText>
      <RenderListings<SmallListingCardProps & ListingCardMetrics>
        render={bodies.small}
        initialData={premiumSmallListingsInitialData}
        flatListProps={{
          horizontal: true,
          ListHeaderComponent: () => <View className="w-4 h-4" />,
        }}
        filter={commonFilters[CommonFilters.Premium]()}
        paramFilters={[{ [FilterKeys.Premium]: CommonFilters.Premium }]}
      />
      <SeparatorText hideLeft wrapperClassName="px-4">
        <Text className="font-medium">Browse popular locations</Text>
      </SeparatorText>
      <SmallLocationCards data={locations} />
      <SeparatorText hideLeft wrapperClassName="px-4">
        <Text className="font-medium">Top rated agents</Text>
      </SeparatorText>
      <RenderUsers<SmallUsersCardProps & UsersCardMetrics>
        mode={UsersRenderMode.small}
        limit={5}
        sort={['score']}
        flatListProps={{
          horizontal: true,
          ListHeaderComponent: () => <View className="w-4 h-4" />,
        }}
        initialData={users}
      />
      <SeparatorText hideLeft wrapperClassName="px-4">
        <Text className="font-medium">News and feeds</Text>
      </SeparatorText>
      <FlatList
        data={news}
        renderItem={({ item }) => <NewsCard news={item} />}
        horizontal
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        ListFooterComponent={() => (
          <ViewAllButton
            horizontal
            button={(props) => (
              <Button
                {...props}
                onPress={() => Linking.openURL(`${portfolioUrl}/news`)}
              />
            )}
          />
        )}
        ListHeaderComponent={() => <View className="w-4 h-4" />}
      />
      <SeparatorText hideLeft wrapperClassName="px-4">
        <Text className="font-medium">Quick links</Text>
      </SeparatorText>
      <View className="flex-row justify-between px-4">
        {externalLinks.map(({ label, href }, index) => (
          <Button
            key={index}
            variant={'base'}
            size={'none'}
            style={{ backgroundColor: opacity(colors.info, 0.1) }}
            className="flex-row gap-1 py-1 px-2 rounded"
            onPress={() => Linking.openURL(href)}
          >
            <Text className="text-info">{label}</Text>
            <ExternalLink size={18} className="text-info" color={colors.info} />
          </Button>
        ))}
      </View>
    </View>
  );
}

export const HomeScreenHeader = () => {
  return (
    <Header>
      <HeaderTitle>A2A Point</HeaderTitle>
    </Header>
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
