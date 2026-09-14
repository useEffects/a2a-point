import { AsyncImage } from 'app/components/async-image';
import { Skeleton } from 'app/components/skeleton';
import { Text } from 'app/components/ui/text';
import { buildAssetUrl } from 'app/lib/helpers';
import { cn } from 'app/lib/utils';
import { View } from 'react-native';
import { ExtraSmallLocationCardProps } from './utils';

export const ExtraSmallLocationCard = (props: ExtraSmallLocationCardProps) => {
  return (
    <View className={cn('flex-row p-2 rounded gap-4 items-center')}>
      <AsyncImage
        source={{ uri: buildAssetUrl(props.avatar) }}
        className="w-6 h-6 rounded-full"
      />
      <Text className="font-normal text-sm">{props.title}</Text>
    </View>
  );
};

export const ExtraSmallLocationCardSkeleton = () => {
  return (
    <View className="flex-row p-2 rounded gap-4 items-center">
      <Skeleton className="w-6 h-6 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </View>
  );
};
