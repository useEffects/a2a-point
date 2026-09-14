import { AsyncImage } from 'app/components/async-image';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { buildAssetUrl } from 'app/lib/helpers';
import { View } from 'react-native';
import { GroupListRowProp } from './types';

export const GroupListRow = (props: GroupListRowProp) => {
  const router = useRouter();
  return (
    <Button
      variant={'ghost'}
      onPress={() => router.push(`/chat/${props.id}`)}
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: buildAssetUrl(props.avatar) }}
      />
      <Text className="!text-base">{props.title}</Text>
    </Button>
  );
};

export const GroupListRowSkeleton = () => {
  return <View></View>;
};
