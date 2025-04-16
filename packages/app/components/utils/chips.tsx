import { useRouter } from 'app/hooks/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { Room } from 'app/lib/types';
import { Image, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { AsyncImage } from '../async-image';
import { Skeleton } from '../skeleton';
import { cn } from 'app/lib/utils';

export const LocationChip = ({
  avatar,
  id,
  title,
}: Pick<Room, 'id' | 'title' | 'avatar'>) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/locations/${id}`)}
      className="flex-row gap-2 items-center rounded justify-start self-start"
    >
      <AsyncImage
        source={{ uri: buildAssetUrl(avatar) }}
        className="w-6 h-6 rounded-full"
      />
      <Text className="text-sm">{title}</Text>
    </Pressable>
  );
};

export const LocationChipSkeleton = ({
  className = '',
}: {
  className?: string;
}) => {
  return (
    <View className={cn('h-6 w-60 flex-row items-center gap-2', className)}>
      <Skeleton className="rounded-full w-6 h-full" />
      <Skeleton className="flex-1 h-[12px]" />
    </View>
  );
};
