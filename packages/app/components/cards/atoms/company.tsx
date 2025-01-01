import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { buildAssetUrl } from 'app/lib/helpers';
import { Image } from 'react-native';
import * as Linking from 'expo-linking';
import { directusUrl } from 'app/lib/constants';
import { AsyncImage } from 'app/components/async-image';

export const CompanyChip = ({
  avatar,
  title,
  id,
}: {
  avatar: string;
  title: string;
  id: string;
}) => {
  return (
    <Button
      variant={'base'}
      size={'none'}
      id={id}
      className="flex-row items-center justify-start"
      onPress={() =>
        Linking.openURL(`${directusUrl}/admin/content/companies/${id}`)
      }
    >
      <AsyncImage
        className="rounded-full w-6 h-6"
        source={{ uri: buildAssetUrl(avatar) }}
      />
      <Text className="text-sm text-primary ml-2">{title}</Text>
    </Button>
  );
};
