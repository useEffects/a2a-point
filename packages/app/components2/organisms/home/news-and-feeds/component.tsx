import { NewsCard, NewsCardSkeleton } from 'app/components/cards/atoms/news';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { NewsProps } from 'app/lib/types';
import { View } from 'react-native';
import { CreateNewsAndFeedsQOpts } from './queries';
import { CardList } from 'app/components2/molecules/card-list/card-list';

export const NewsAndFeedsShowcase = () => {
  const newsQOpts = new CreateNewsAndFeedsQOpts().get();
  return (
    <View className="flex-col gap-4 px-4">
      <SeparatorText hideLeft>
        <Text className="font-medium">News and feeds</Text>
      </SeparatorText>
      <CardList<NewsProps>
        component={NewsCard}
        queryOptions={newsQOpts}
        skeletonComponent={NewsCardSkeleton}
        flatListProps={{
          horizontal: true,
          ItemSeparatorComponent: () => <View className="w-4 h-4" />,
        }}
        viewAllLink="https://a2apoint.com/news"
      />
    </View>
  );
};
