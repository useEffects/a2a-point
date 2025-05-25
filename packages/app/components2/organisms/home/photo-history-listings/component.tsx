import { useAuthFlow } from 'app/application/auth/hooks';
import {
  PhotoListingProps,
  PhotoListingCard,
  PhotoListingCardSkeleton,
} from 'app/components/cards/atoms/photo';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Clock } from 'lucide-react-native';
import { View } from 'react-native';
import { CreatePhotoListingsQOPts } from './queries';

export const PhotoListingCards = () => {
  const {
    data: { isAuthenticated },
  } = useAuthFlow();
  const { colors } = useColorScheme();
  const queryOptions = new CreatePhotoListingsQOPts().get();

  return (
    <View className="flex-col justify-start gap-4 px-4 bg-card py-8">
      <SeparatorText hideLeft>
        <View className="flex-row items-center gap-2">
          {isAuthenticated ? (
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
      <CardList<PhotoListingProps>
        component={PhotoListingCard}
        queryOptions={queryOptions}
        skeletonComponent={PhotoListingCardSkeleton}
        flatListProps={{
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          ItemSeparatorComponent: () => <View className="w-4 h-4" />,
        }}
        viewAllLink="/listings"
      />
    </View>
  );
};
