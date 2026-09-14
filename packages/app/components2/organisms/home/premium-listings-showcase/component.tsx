import { CommonFilters } from 'app/components/cards/molecules/listings';
import { SeparatorText } from 'app/components/separator-text';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { useColorScheme } from 'app/hooks/color-scheme';
import { FilterKeys } from 'app/screens/listings';
import { ArrowUpRight } from 'lucide-react-native';
import { View } from 'react-native';
import { CreatePremiumListingCardsQOpts } from './queries';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import {
  SmallListingCard,
  SmallListingCardProps,
  SmallListingCardSkeleton,
} from 'app/components/cards/atoms/small';
import { ListingCardMetrics } from 'app/lib/props';

export const PremiumListingsShowCase = () => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const premiumListingsQOpts = new CreatePremiumListingCardsQOpts().get();

  return (
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
      <CardList<SmallListingCardProps & ListingCardMetrics>
        flatListProps={{
          horizontal: true,
          ListHeaderComponent: () => <View className="w-4 h-4" />,
        }}
        component={SmallListingCard}
        skeletonComponent={SmallListingCardSkeleton}
        queryOptions={premiumListingsQOpts}
        viewAllLink="/"
      />
    </View>
  );
};
