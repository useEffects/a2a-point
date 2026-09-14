import { View } from 'react-native';
import { Text } from 'app/components/ui/text';
import { AsyncImage } from 'app/components/async-image';
import { useRouter } from 'app/hooks/router';

export const SmallListingCard = (props: any) => {
  const router = useRouter();
  return (
    <View>
      <AsyncImage source={{}} />
      <Text>Hello world</Text>
    </View>
  );
};
