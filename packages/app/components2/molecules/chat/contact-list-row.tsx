import { AsyncImage } from 'app/components/async-image';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { buildAssetUrl, getDMRoomId } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { View } from 'react-native';
import { ContactListRowProp } from './types';
import { Pressable } from 'app/components/pressable';

export const ContactListRow = (props: ContactListRowProp) => {
  const { user } = userStore();
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        getDMRoomId([String(props.id), user.id]).then((id) =>
          router.push(`/chat/${id}`),
        )
      }
      className="flex-row gap-4 items-center w-full justify-start !h-20 active:bg-accent rounded p-4"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: buildAssetUrl(props.avatar) }}
      />
      <Text className="!text-base">
        {props.first_name} {props.last_name}
      </Text>
    </Pressable>
  );
};

export const ContactListRowSkeleton = () => {
  return <View></View>;
};
