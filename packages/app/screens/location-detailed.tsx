import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import {
  CommonFilters,
  RenderListings,
  bodies,
  commonFilters,
} from 'app/components/cards/molecules/listings';
import { MembersList } from 'app/components/cards/molecules/locations';
import { FullWidthImage } from 'app/components/full-width-image';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import { SeparatorText } from 'app/components/separator-text';
import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { ListingCardMetrics } from 'app/lib/props';
import { Room, User } from 'app/lib/types';
import { directusStore } from 'app/store/directus';
import { ArrowUpRight } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { FilterKeys } from './listings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'app/hooks/color-scheme';

export type LocationListingProps = Pick<Room, 'id' | 'avatar' | 'title'> & {
  members: {
    directus_users_id: Pick<User, 'id' | 'avatar'>;
  }[];
};

export type LocationDetailedProps = {
  room: Pick<Room, 'id' | 'avatar' | 'title'> & {
    members: {
      directus_users_id: Pick<User, 'id' | 'avatar'>;
    }[];
  };
  totalMembers: number;
  listings: (MediumListingCardProps & ListingCardMetrics)[];
};

export function LocationDetailed(props: LocationDetailedProps) {
  const { authenticated } = directusStore();
  const router = useRouter();
  const { colors } = useColorScheme();

  const { room, totalMembers } = props;

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="flex-grow max-w-xl py-4">
        <FullWidthImage source={{ uri: buildAssetUrl(room.avatar) }} />
        <View className="flex-1 p-4 flex-col gap-4">
          <View className="flex-row items-center justify-between pr-4">
            <Button
              disabled={!authenticated}
              className="flex-row"
              variant={'default'}
              size={'sm'}
              onPress={() => router.push(`/chat/${room.id}`)}
            >
              <Text>Open group chat</Text>
              <ArrowUpRight
                size={16}
                className="text-primary-foreground"
                color={colors['primary-foreground']}
              />
            </Button>
            <MembersList
              locationId={room.id}
              members={room.members}
              total={totalMembers}
            />
          </View>
          <SeparatorText hideLeft>
            <Text>Listings Posted</Text>
          </SeparatorText>
          <RenderListings<MediumListingCardProps & ListingCardMetrics>
            render={bodies.medium}
            filter={commonFilters[CommonFilters.GroupId](room.id)}
            flatListProps={{
              scrollEnabled: Platform.OS === 'web',
              ItemSeparatorComponent: () => <Separator className="my-2" />,
            }}
            paramFilters={[
              {
                [FilterKeys.Location]: room.id,
              },
            ]}
            initialData={props.listings}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export function LocationDetailedScreenHeader({ title }: { title: string }) {
  const { top } = useSafeAreaInsets();
  return (
    <Header height={'auto'}>
      <View
        className="flex-row items-center pb-4"
        style={{ paddingTop: top + 16 }}
      >
        <View className="h-12 flex-row items-center gap-4">
          <BackButton />
          <HeaderTitle>{title}</HeaderTitle>
        </View>
      </View>
    </Header>
  );
}
