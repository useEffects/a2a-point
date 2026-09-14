import { readItem } from '@directus/sdk';
import { Mode, RenderUsers } from 'app/components/cards/molecules/users';
import {
  RenderRoomTileProps,
  useAutoCompleteItem,
} from 'app/components/formComponents';
import { Header } from 'app/components/header';
import { Text } from 'app/components/ui/text';
import { shortString } from 'app/lib/helpers';
import { MediumUsersCardProps, mediumUsersFields } from 'app/lib/props';
import { directusStore } from 'app/store/directus';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export const MembersListScreenComponent = ({
  locationId,
}: {
  locationId: string;
}) => {
  const [members, setMembers] = useState<MediumUsersCardProps[]>([]);
  const { rest } = directusStore();

  const location = useAutoCompleteItem(
    'rooms',
    locationId,
  ) as RenderRoomTileProps | null;

  useEffect(() => {
    async function fetchMembers() {
      const res = (await rest.request(
        readItem('rooms', locationId, {
          fields: mediumUsersFields.map(
            (f) => `members.directus_users_id.${f}`,
          ),
          join: ['rooms_directus_users.users_id'],
        }),
      )) as {
        members: {
          directus_users_id: MediumUsersCardProps;
        }[];
      };
      setMembers(res.members.map((m) => m.directus_users_id));
    }
    fetchMembers();
  }, []);

  return (
    <View className="flex-1">
      <Header>
        <Text className="text-xl font-bold">
          Members in {shortString(location?.title ?? '')}
        </Text>
      </Header>
      <RenderUsers<MediumUsersCardProps>
        mode={Mode.medium}
        flatListProps={{
          contentContainerClassName: 'p-4',
        }}
        initialData={[]}
      />
    </View>
  );
};
