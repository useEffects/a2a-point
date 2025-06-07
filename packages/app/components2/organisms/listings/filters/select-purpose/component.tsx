import { Text } from 'app/components/ui/text';
import { View } from 'react-native';
import { Purpose, PurposeSkeleton } from './purpose';
import { CreatePurposeQOpts } from './queries';
import { CardList } from 'app/components2/molecules/card-list/card-list';

export const SelectPurpose = () => {
  const createQOpts = new CreatePurposeQOpts().get();
  return (
    <View className="flex-col gap-4 flex-1">
      <Text className="text-lg">Select Type</Text>
      <CardList
        component={Purpose}
        skeletonComponent={PurposeSkeleton}
        queryOptions={createQOpts}
        flatListProps={{
          ItemSeparatorComponent: () => <View className="w-4 h-4" />,
          contentContainerStyle: { flexGrow: 1 },
          horizontal: true,
        }}
      />
    </View>
  );
};
