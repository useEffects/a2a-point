import { useRouter } from 'app/hooks/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { Room } from 'app/lib/types';
import { Image, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { AsyncImage } from '../async-image';

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
