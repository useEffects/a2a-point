import { AsyncImage } from 'app/components/async-image';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { ContactListRowProp } from 'app/components2/organisms/chat-search-results/types';
import { useRouter } from 'app/context/router';
import { buildAssetUrl, getDMRoomId } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { View } from 'react-native';

export const ContactListRow = (contact: ContactListRowProp) => {
  const { user } = userStore();
  const router = useRouter();
  return (
    <Button
      onPress={() =>
        getDMRoomId([contact.id, user.id]).then((id) =>
          router.push(`/chat/${id}`),
        )
      }
      variant={'ghost'}
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: buildAssetUrl(contact.avatar) }}
      />
      <Text className="!text-base">
        {contact.first_name} {contact.last_name}
      </Text>
    </Button>
  );
};

export const ContactListRowSkeleton = () => {
  return <View></View>;
};
