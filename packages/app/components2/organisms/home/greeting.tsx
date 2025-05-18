import {
  PhotoListingProps,
  PhotoListingCard,
  PhotoListingCardSkeleton,
} from 'app/components/cards/atoms/photo';
import InfiniteList from 'app/components/infinite';
import { SeparatorText } from 'app/components/separator-text';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { getTimeofDay } from 'app/lib/helpers';
import {
  photoHistoryListingsQuery,
  photoListingsQuery,
} from 'app/screens/home/queries';
import { categoryTiles } from 'app/screens/listings';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import { useRouter } from 'expo-router';
import { startCase, lowerCase } from 'lodash';
import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

export const Greeting = () => {
  const { user } = userStore();
  const { authenticated } = directusStore();
  const [timeOfDay] = useState(
    authenticated ? startCase(lowerCase(getTimeofDay())) : null,
  );
  const router = useRouter();
  const { colors } = useColorScheme();

  const queryOptions = authenticated
    ? photoHistoryListingsQuery()
    : photoListingsQuery();

  return (
    <View className="flex-col gap-8">
      <View className="px-4 flex-col gap-2">
        <Text className="font-bold text-3xl">
          {authenticated
            ? `Good ${timeOfDay}, ${user.first_name}`
            : 'Welcome to A2A Point'}
        </Text>
        <Text className="text-subtext font-medium">
          {authenticated
            ? 'What are we looking at Today?'
            : 'One stop for all Agents!'}
        </Text>
        <View className="flex-row gap-2">
          {categoryTiles.map((cat, i) => (
            <Button
              key={i}
              onPress={() =>
                router.push(
                  `/listings?filters=${JSON.stringify([
                    {
                      [cat.key]: cat.value,
                    },
                  ])}`,
                )
              }
              variant={'secondary'}
              size={'sm'}
            >
              <Text>{cat.title}</Text>
            </Button>
          ))}
        </View>
      </View>

      <View className="flex-col justify-start gap-4 px-4 bg-card py-8">
        <SeparatorText hideLeft>
          <View className="flex-row items-center gap-2">
            {authenticated ? (
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
        <InfiniteList<PhotoListingProps>
          component={PhotoListingCard}
          infiniteQueryOptions={queryOptions}
          skeletonComponent={PhotoListingCardSkeleton}
          flatListProps={{
            horizontal: true,
            showsHorizontalScrollIndicator: false,
            ItemSeparatorComponent: () => <View className="w-4 h-4" />,
          }}
          viewAllLink="/listings"
        />
      </View>
    </View>
  );
};
