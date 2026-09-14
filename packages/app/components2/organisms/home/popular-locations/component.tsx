import {
  SmallLocationCard,
  SmallLocationCardSkeleton,
} from 'app/components/cards/molecules/locations';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import { SmallLocationCardProps } from 'app/lib/props';
import { View } from 'react-native';
import { CreatePopularLocationCardsQpts } from './queries';

export const PopularLocatinsShowCase = () => {
  const smallLocationsQOpts = new CreatePopularLocationCardsQpts().get();

  return (
    <View className="flex-col gap-4 bg-card p-4">
      <SeparatorText hideLeft>
        <Text className="font-medium">Browse popular locations</Text>
      </SeparatorText>
      <CardList<SmallLocationCardProps>
        component={SmallLocationCard}
        skeletonComponent={SmallLocationCardSkeleton}
        queryOptions={smallLocationsQOpts}
        flatListProps={{
          horizontal: true,
          ItemSeparatorComponent: () => <View className="w-4 h-4" />,
        }}
        viewAllLink="/locations"
        numRows={2}
        skeletonCount={16}
      />
    </View>
  );
};
