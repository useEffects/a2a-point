import { NewsCard, NewsCardSkeleton } from 'app/components/cards/atoms/news';
import {
  SmallListingCard,
  SmallListingCardProps,
  SmallListingCardSkeleton,
} from 'app/components/cards/atoms/small';
import { CommonFilters } from 'app/components/cards/molecules/listings';
import {
  SmallLocationCard,
  SmallLocationCardSkeleton,
} from 'app/components/cards/molecules/locations';
import { CompanyStats } from 'app/components/company-stats';
import { Header, HeaderTitle } from 'app/components/header';
import { ArrowUpRight, ExternalLink } from 'app/components/icons';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { directusUrl, portfolioUrl } from 'app/lib/constants';
import {
  ListingCardMetrics,
  SmallLocationCardProps,
  SmallUsersCardProps,
  UsersCardMetrics,
} from 'app/lib/props';
import { NewsProps } from 'app/lib/types';
import * as Linking from 'expo-linking';
import opacity from 'hex-color-opacity';
import { View } from 'react-native';
import { FilterKeys } from '../listings';
import { Button } from 'app/components/ui/button';
import Logo from 'app/components/svg/logo';
import InfiniteList from 'app/components/infinite';
import {
  newsQuery,
} from './queries';
import { premiumListingsSmallQuery } from '../listings/queries';
import { smallLocationsCardQuery } from '../locations/queries';
import { smallUsersQuery } from '../agents/queries';
import {
  SmallUsersCardSkeleton,
  SmallUsersCard,
} from 'app/components/cards/atoms/users';
import { Greeting } from 'app/components2/organisms/home/greeting';

export function HomeScreen() {
  const { colors } = useColorScheme();
  const router = useRouter();

  const smallLocationsQueryOptions = smallLocationsCardQuery({
    limit: 16,
  });
  const smallUsersQueryOptions = smallUsersQuery();
  const premiumListingsSmallQueryOptions = premiumListingsSmallQuery();
  const newsQueryOptions = newsQuery();

  return (
    <View className="flex-grow flex-col gap-8 py-8">
      <Greeting />

      <View className="px-4 flex-col gap-4">
        <SeparatorText hideLeft>
          <Text className="font-medium">At your Glance</Text>
        </SeparatorText>
        <CompanyStats className="gap-4" />
      </View>

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
      <View className="flex-row items-center gap-2 justify-between flex-1">
        <HeaderTitle>A2A Point</HeaderTitle>
        <View className="rounded-full bg-light p-1 border-border">
          <Logo height={32} width={32} />
        </View>
      </View>
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
