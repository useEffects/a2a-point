import {
  MediumListingCard,
  MediumListingCardProps,
  MediumListingCardSkeleton,
} from 'app/components/cards/atoms/medium';
import {
  CommonFilters,
  RenderListings,
  bodies,
  commonFilters,
} from 'app/components/cards/molecules/listings';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import { Bookmark, Eye } from 'app/components/icons';
import InfiniteList from 'app/components/infinite';
import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { ListingCardMetrics } from 'app/lib/props';
import { cn } from 'app/lib/utils';
import { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { seenByMeListingsQuery, savedByMeListingsQuery } from './queries';

export function ActivityScreen() {
  const [navigationState, setNavigationState] = useState<
    NavigationState<Route>
  >({
    index: 0,
    routes: [{ key: 'viewed' }, { key: 'saved' }],
  });
  return (
    <View className="flex-1 px-4 pb-8">
      <TabView
        renderTabBar={(props) => (
          <TabBar {...props} navigationState={navigationState} />
        )}
        navigationState={navigationState}
        onIndexChange={(index) =>
          setNavigationState({ ...navigationState, index })
        }
        renderScene={SceneMap({
          viewed: RenderViewed,
          saved: RenderSaved,
        })}
      />
    </View>
  );
}

export function ActivityScreenHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <Header>
      <View className="flex-row items-center gap-4">
        <BackButton />
        <HeaderTitle>Activity</HeaderTitle>
      </View>
    </Header>
  );
}

const RenderViewed = () => {
  const seenByMeListingsQueryOptions = seenByMeListingsQuery();
  return (
    <InfiniteList<MediumListingCardProps & ListingCardMetrics>
      infiniteQueryOptions={seenByMeListingsQueryOptions}
      component={MediumListingCard}
      skeletonComponent={MediumListingCardSkeleton}
      flatListProps={{
        contentContainerClassName: 'flex-grow',
        ItemSeparatorComponent: () => <Separator className="my-4" />,
      }}
      infinite
    />
  );
};

const RenderSaved = () => {
  const savedByMeListingsQueryOptions = savedByMeListingsQuery();
  return (
    <InfiniteList<MediumListingCardProps & ListingCardMetrics>
      infiniteQueryOptions={savedByMeListingsQueryOptions}
      component={MediumListingCard}
      skeletonComponent={MediumListingCardSkeleton}
      flatListProps={{
        contentContainerClassName: 'flex-grow',
        ItemSeparatorComponent: () => <Separator className="my-4" />,
      }}
      infinite
    />
  );
};

const TabBar = (
  props: SceneRendererProps & { navigationState: NavigationState<Route> },
) => {
  const map: {
    [k: string]: {
      label: string;
      Icon: LucideIcon;
    };
  } = {
    viewed: {
      label: 'Viewed',
      Icon: Eye,
    },
    saved: {
      label: 'Saved',
      Icon: Bookmark,
    },
  };

  return (
    <View className="flex-row w-full items-center h-24 mb-4">
      {props.navigationState.routes.map((route, index) => {
        const { label, Icon } = map[route.key]!;
        return (
          <View key={index} className="flex-1">
            <Button
              variant={'base'}
              size={'none'}
              className={cn(
                'border-0 pb-4',
                index === props.navigationState.index &&
                  'border-b-[1px] border-primary',
              )}
              onPress={() => props.jumpTo(route.key)}
            >
              <Icon
                size={18}
                className={cn(
                  index === props.navigationState.index
                    ? 'text-primary'
                    : 'text-foreground',
                )}
              />
              <Text
                className={cn(
                  index === props.navigationState.index
                    ? 'text-primary'
                    : 'text-foreground',
                )}
              >
                {label}
              </Text>
            </Button>
          </View>
        );
      })}
    </View>
  );
};
