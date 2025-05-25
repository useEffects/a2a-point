import {
  SmallUsersCard,
  SmallUsersCardSkeleton,
} from 'app/components/cards/atoms/users';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { SmallUsersCardProps, UsersCardMetrics } from 'app/lib/props';
import { View } from 'react-native';
import { CreateTopRatedAgentsQOpts } from './queries';
import { CardList } from 'app/components2/molecules/card-list/card-list';

export const TopRatedAgentsShowCase = () => {
  const smallUsersQOpts = new CreateTopRatedAgentsQOpts().get();

  return (
    <View className="flex-col gap-4 px-4">
      <SeparatorText hideLeft>
        <Text className="font-medium">Top rated agents</Text>
      </SeparatorText>
      <CardList<SmallUsersCardProps & UsersCardMetrics>
        component={SmallUsersCard}
        skeletonComponent={SmallUsersCardSkeleton}
        flatListProps={{
          horizontal: true,
          ItemSeparatorComponent: () => <View className="w-4 h-4" />,
        }}
        queryOptions={smallUsersQOpts}
        viewAllLink="/agents"
      />
    </View>
  );
};
