import { AsyncImage } from 'app/components/async-image';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { GroupListRowProp } from 'app/components2/organisms/chat-search-results/types';
import { useRouter } from 'app/context/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { View } from 'react-native';

export const GroupListRow = (group: GroupListRowProp) => {
  const router = useRouter();
  return (
    <Button
      variant={'ghost'}
      onPress={() => router.push(`/chat/${group.id}`)}
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: buildAssetUrl(group.avatar) }}
      />
      <Text className="!text-base">{group.title}</Text>
    </Button>
  );
};

export const GroupListRowSkeleton = () => {
  return <View></View>;
};
