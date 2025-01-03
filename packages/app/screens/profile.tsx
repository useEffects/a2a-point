import { deleteItem, readItems } from '@directus/sdk';
import ProfileImgDark from 'app/assets/locked-screens/dark/profile.jpg';
import ProfileImgLight from 'app/assets/locked-screens/light/profile.jpg';
import {
  RenderUserTileProps,
  useAutoCompleteItem,
} from 'app/components/formComponents';
import { Header, HeaderTitle } from 'app/components/header';
import {
  ArrowUp,
  Bell,
  EllipsisVertical,
  Expand,
  Info,
  LogOut,
  MessageCircle,
  Rows2,
  Shrink,
  UserCog2,
} from 'app/components/icons';
import { ToggleTheme } from 'app/components/toggle-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'app/components/ui/dropdown-menu';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { UserChip } from 'app/components/user-chip';
import { FlatList, ScrollView } from 'app/components/utils/virtual-lists';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { directusUrl } from 'app/lib/constants';
import { buildAssetUrl, timeAgo } from 'app/lib/helpers';
import { getListingsCountForUser } from 'app/lib/misc/queries';
import { ListingCardMetrics } from 'app/lib/props';
import { Company, Document, Feedback, User } from 'app/lib/types';
import { cn } from 'app/lib/utils';
import { StarIcon } from 'app/screens/post-feedback';
import { directusStore } from 'app/store/directus';
import { queryClient } from 'app/store/query';
import userStore from 'app/store/user';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  DimensionValue,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import StarRating, { StarIconProps } from 'react-native-star-rating-widget';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { Link } from 'expo-router';
import { ExtraSmallListingCardProps } from '../components/cards/atoms/extra-small';
import { MediumListingCardProps } from '../components/cards/atoms/medium';
import {
  CommonFilters,
  RenderListings,
  bodies,
  commonFilters,
} from '../components/cards/molecules/listings';
import { Button } from '../components/ui/button';
import { FilterKeys } from './listings';
import LockedScreen from './locked-screens';
import { AsyncImage } from 'app/components/async-image';

const LockedProfileScreen = ({ userId }: { userId: string }) => {
  const { isDarkColorScheme } = useColorScheme();

  const userDetails = useAutoCompleteItem(
    'users',
    userId,
  ) as RenderUserTileProps | null;
  const title = userDetails
    ? `${userDetails.first_name} ${userDetails.last_name}`
    : 'Profile';

  return (
    <LockedScreen
      image={isDarkColorScheme ? ProfileImgDark : ProfileImgLight}
      description="Showcase your expertise, recent transactions, and client testimonials to other agents. Build trust and credibility within the real estate community."
      headerTitle={''}
      title="Build your profile!"
      header={() => (
        <Header shouldntGoBack>
          <View className="flex-row flex-grow items-center justify-between">
            <HeaderTitle>{title}</HeaderTitle>
            <ToggleTheme />
          </View>
        </Header>
      )}
    />
  );
};

export const ProfileScreen = (props: {
  user: User;
  company?: Company | null;
  document?: Document | null;
}) => {
  const { authenticated } = directusStore();

  return authenticated ? (
    <Profile {...props} />
  ) : (
    <LockedProfileScreen userId={props.user.id} />
  );
};

export function Profile({
  user,
  company,
  document,
}: {
  user: User;
  company?: Company | null;
  document?: Document | null;
}) {
  const [index, setIndex] = useState(0);
  const { colors } = useColorScheme();
  const [listingsCount, setListingsCount] = useState<number | null>(0);
  const { width, height } = useWindowDimensions();
  const [collapsed, setCollapsed] = useState(false);
  const [big, setBig] = useState(false);
  const { user: currentUser } = userStore();
  const { authenticated } = directusStore();
  const router = useRouter();

  useEffect(() => {
    getListingsCountForUser(user.id).then(setListingsCount);
  }, [user.id]);

  const TabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<any> },
  ) => {
    const index = props.navigationState.index;
    const onPress = (i: number) => {
      props.jumpTo(tabTitles[i]!);
    };
    const buttonWidth = (
      Platform.OS === 'web' ? 'calc(50% - 0.5rem)' : width / 2 - 14 - 8
    ) as DimensionValue;

    return (
      <>
        <Collapsible duration={500} collapsed={collapsed}>
          <View className="flex-col gap-8 my-8">
            <View className="flex-col gap-4 items-center">
              <AsyncImage
                source={{ uri: buildAssetUrl(user.avatar) }}
                className="w-24 h-24 rounded-full"
              />
              <View className="flex-col items-center">
                <Text className="text-primary font-semibold">
                  {user.first_name} {user.last_name}
                </Text>
                <Link href={`mailto:${user.email}`}>
                  <Text className="text-info underline">{user.email}</Text>
                </Link>
                <Text>{user.location}</Text>
                <Text className="text-subtext">{user.title}</Text>
              </View>
            </View>
            <View className="flex-row w-full justify-evenly">
              <View className="flex-col items-center">
                <Text>{listingsCount}</Text>
                <Text className="text-subtext">Listings</Text>
              </View>
              <View className="flex-col items-center">
                <Text>{user.computed_rating ?? '-'}</Text>
                <Text className="text-subtext">Rating</Text>
              </View>
              <View className="flex-col items-center">
                <Text>{timeAgo.format(new Date(user.last_access))}</Text>
                <Text className="text-subtext">Last Seen</Text>
              </View>
            </View>
            <View className="flex-row w-full justify-between px-4">
              <Button
                onPress={() =>
                  Linking.openURL(`${directusUrl}/admin/users/${user.id}`)
                }
                size="sm"
                style={{ width: buttonWidth }}
              >
                <Text>Open in dashboard</Text>
              </Button>
              {user.id === currentUser.id ? (
                <Button
                  onPress={() => router.push('/agents/me/activity')}
                  variant={'default'}
                  size="sm"
                  style={{ width: buttonWidth }}
                >
                  <Text>Your activity</Text>
                </Button>
              ) : (
                <Button
                  onPress={() => router.push(`/agents/feedbacks/${user.id}`)}
                  size={'sm'}
                  style={{ width: buttonWidth }}
                  variant={'default'}
                >
                  <Text>Give feedback</Text>
                </Button>
              )}
            </View>
          </View>
        </Collapsible>
        <View className="flex-row justify-between px-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Button
                className={cn(
                  'w-1/3 border border-0 rounded-none border-primary',
                  i === index ? 'border-b-[1px] h-12' : 'border-b-0',
                )}
                key={i}
                variant={'base'}
                onPress={() => onPress(i)}
              >
                <TabIcons index={i} isActive={i === index} />
              </Button>
            ))}
        </View>
      </>
    );
  };

  const RenderScene = (props: SceneRendererProps & { route: any }) => {
    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { nativeEvent } = e;
      if (nativeEvent.contentOffset.y > 0) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    const renderScene = SceneMap({
      info: () => <InfoTab user={user} company={company} />,
      listings: () => <ListingTab user={user} big={big} setBig={setBig} />,
      feedbacks: () => <ListingFeedbacks userId={user.id} />,
    });

    return (
      <ScrollView
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
        onScrollEndDrag={onScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {renderScene(props)}
      </ScrollView>
    );
  };
  return (
    <View className="relative flex-1">
      <Header shouldntGoBack>
        <View className="flex-row items-center justify-between flex-grow">
          <Text className="text-xl font-bold">
            {currentUser.id !== user.id
              ? `${user.first_name} ${user.last_name}`
              : 'Profile'}
          </Text>
          <View className="flex-row gap-[1ch] items-center">
            <ToggleTheme />
            <ProfileDropdown />
          </View>
        </View>
      </Header>
      <TabView
        style={{ height }}
        renderTabBar={TabBar}
        navigationState={{
          index,
          routes: tabTitles.map((title) => ({ key: title, title })),
        }}
        renderScene={(props) => <RenderScene {...props} />}
        onIndexChange={setIndex}
        initialLayout={{ width }}
      />
      {collapsed ? (
        <Button
          onPress={() => setCollapsed(false)}
          className="absolute bottom-8 right-4 top-auto left-auto rounded-full"
          size={'icon'}
        >
          <ArrowUp size={18} color={colors['primary-foreground']} />
        </Button>
      ) : (
        <></>
      )}
    </View>
  );
}

const tabTitles = ['info', 'listings', 'feedbacks'];

const TabIcons = ({
  index,
  isActive,
}: {
  index: number;
  isActive: boolean;
}) => {
  const { colors } = useColorScheme();
  const tabIcons = [Info, Rows2, MessageCircle];
  const Icon = tabIcons[index]!;
  return (
    <Icon
      style={{ marginVertical: 4 }}
      size={18}
      color={isActive ? colors.primary : colors.foreground}
    />
  );
};

const InfoTab = ({
  user,
  company,
}: {
  user: User;
  company?: Company | null;
}) => {
  return (
    <View className="p-4 flex-col gap-4 w-full">
      {company ? (
        <View className="rounded p-4 bg-card border border-border gap-4">
          <Text className="text-xl font-semibold">Company</Text>
          <WithLabel label="Title">
            <Text>{company.title}</Text>
          </WithLabel>
          <WithLabel label="Address">
            <Text>{company.address}</Text>
          </WithLabel>
          <WithLabel label="DED License">
            <Text>{company.DED_LISC}</Text>
          </WithLabel>
          <WithLabel label="ORN">
            <Text>{company.ORN}</Text>
          </WithLabel>
          <WithLabel label="Phone">
            <Text>{company.phone}</Text>
          </WithLabel>
          <WithLabel label="Fax">
            <Text>{company.fax}</Text>
          </WithLabel>
          <WithLabel label="Email">
            <Text>{company.email}</Text>
          </WithLabel>
        </View>
      ) : (
        <></>
      )}
      {user.description && user.tags && user.tags.length ? (
        <View className="flex flex-col gap-4 w-full">
          <Text className="text-xl font-semibold">Bio</Text>
          <Text className="text-sm">{user.description}</Text>
          <View className="flex-row flex-wrap gap-2 w-full">
            {user.tags.map((tag, index) => (
              <Text
                className="rounded-full border border-solid border-foreground px-2 w-auto"
                key={index}
              >
                {tag}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <></>
      )}
      {user.social_media ? (
        <View className="flex-col gap-4">
          <Text className="text-xl font-semibold">Social links</Text>
          <View className="flex-row gap-4">
            {user.social_media.map((item, i) => (
              <View key={i} className="flex flex-row gap-2 items-center">
                <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                  <Text className="underline">{item.link}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <></>
      )}
      {user.work_experience ? (
        <View className="flex-col gap-4">
          <Text className="text-xl font-semibold">Work experience</Text>
          {user.work_experience.map((item, i) => (
            <View
              key={i}
              className="flex flex-col gap-2 border border-solid p-4 border-border"
            >
              <View className="flex-col gap-4">
                <View className="flex-row items-center gap-4">
                  {item.company_logo && (
                    <Image
                      source={{ uri: item.company_logo }}
                      className="w-16 h-16 rounded"
                    />
                  )}
                  <View className="flex flex-col gap-2 justify-center">
                    <Text>{item.company_name}</Text>
                    <Text>{item.title}</Text>
                  </View>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-row gap-2">
                    {/* <Foundation name="clock" className="!text-foreground" size={24} /> */}
                    <Text>{item.start_date}</Text>
                    <Text>{item.end_date ?? 'Present'}</Text>
                  </View>
                  <View className="flex-row gap-2">
                    {/* <Foundation name="map" size={24} className="!text-foreground" /> */}
                    <Text>{item.location}</Text>
                  </View>
                </View>
              </View>
              <Text>{item.description}</Text>
            </View>
          ))}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const ListingTab = ({
  user,
  big,
  setBig,
}: {
  user: User;
  big: boolean;
  setBig: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useColorScheme();

  return (
    <View className="p-4 flex-col gap-4 flex-1">
      <View className="flex-row justify-between">
        <Text className="text-subtext">Leads posted by the user</Text>
        <Button
          variant={'base'}
          size={'none'}
          onPress={() => setBig((p) => !p)}
        >
          {big ? (
            <Shrink size={18} color={colors.secondary} />
          ) : (
            <Expand size={18} color={colors.secondary} />
          )}
        </Button>
      </View>
      {big ? (
        <RenderListings<MediumListingCardProps & ListingCardMetrics>
          render={bodies.medium}
          filter={commonFilters[CommonFilters.User](user.id)}
          noAds={true}
          flatListProps={{
            scrollEnabled: false,
          }}
          paramFilters={[
            {
              [FilterKeys.Agent]: user.id,
            },
          ]}
          initialData={[]}
        />
      ) : (
        <RenderListings<ExtraSmallListingCardProps>
          render={bodies.extraSmall}
          filter={commonFilters[CommonFilters.User](user.id)}
          flatListProps={{
            scrollEnabled: false,
          }}
          paramFilters={[{ [FilterKeys.Agent]: user.id }]}
          initialData={[]}
        />
      )}
    </View>
  );
};

export type UserFeedbacksProps = Omit<Feedback, 'user_created'> & {
  user_created: Pick<
    User,
    'id' | 'first_name' | 'last_name' | 'avatar' | 'plan'
  >;
};

const ListingFeedbacks = ({ userId }: { userId: string }) => {
  const { rest } = directusStore();
  const [data, setData] = useState<UserFeedbacksProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await queryClient.fetchQuery<UserFeedbacksProps[]>({
        queryKey: ['listing-feedbacks', userId],
        queryFn: async () =>
          (await rest.request(
            readItems('feedbacks', {
              fields: [
                '*',
                'user_created.id',
                'user_created.first_name',
                'user_created.last_name',
                'user_created.avatar',
              ],
              filter: {
                agent: { _eq: userId },
              },
            }),
          )) as UserFeedbacksProps[],
        initialData: [],
      });
      setData(res);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await rest.request(deleteItem('feedbacks', id));
    setData(data.filter((item) => item.id !== id));
  };

  return !data?.length ? (
    <View className="p-4">
      <Text>No feedbacks received yet</Text>
    </View>
  ) : (
    <FlatList
      contentContainerClassName="p-4"
      data={data}
      renderItem={({ item }) => (
        <RenderFeedbackCard {...item} handleDelete={handleDelete} />
      )}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <Separator className="my-6" />}
    />
  );
};

const RenderFeedbackCard = (
  props: UserFeedbacksProps & { handleDelete: (id: string) => void },
) => {
  const { user } = userStore();
  const router = useRouter();

  return (
    <View className="flex-col gap-4">
      <View className="flex-row items-center justify-between">
        <UserChip user={props.user_created} />
        {user.id === props.user_created.id ? (
          <View className="flex-row items-center gap-2">
            <Button
              onPress={() =>
                router.push(`/agents/${props.agent}/feedback?id=${props.id}`)
              }
              size={'sm'}
              variant={'outline'}
            >
              <Text>Edit</Text>
            </Button>
            <Button
              onPress={() => props.handleDelete(props.id)}
              size={'sm'}
              variant={'outline'}
            >
              <Text>Delete</Text>
            </Button>
          </View>
        ) : (
          <></>
        )}
      </View>
      <StarRating
        onChange={() => {}}
        StarIconComponent={(props: StarIconProps) => (
          <StarIcon {...props} size={18} />
        )}
        rating={props.rating}
      />
      <Text>{props.content}</Text>
    </View>
  );
};

const WithLabel = ({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={cn('flex-col, gap-1', className)}>
      <Text className="text-subtext text-sm">{label}</Text>
      {children}
    </View>
  );
};

const ProfileDropdown = () => {
  const router = useRouter();

  const [_, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <EllipsisVertical size={24} className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={Platform.OS !== 'web' ? -40 : undefined}>
        <DropdownMenuItem>
          <View className="flex-row items-center gap-2">
            <LogOut size={18} className="text-popover-foreground" />
            <Text>Logout</Text>
          </View>
        </DropdownMenuItem>
        <DropdownMenuItem
          onPress={() => {
            setOpen(false);
            router.push('/agents/me/notifications');
          }}
        >
          <View className="flex-row items-center gap-2">
            <Bell size={18} className="text-popover-foreground" />
            <Text>Notifications</Text>
          </View>
        </DropdownMenuItem>
        <DropdownMenuItem
          onPress={() => {
            setOpen(false);
            router.push('/account-console');
          }}
        >
          <View className="flex-row items-center gap-2">
            <UserCog2 size={18} className="text-popover-foreground" />
            <Text>Account console</Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
