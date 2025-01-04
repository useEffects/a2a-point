import { useQuery } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { directusUrl } from 'app/lib/constants';
import { ProfileScreen } from 'app/screens/profile';
import { useGlobalSearchParams } from 'expo-router';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileDetailed() {
  const params = useGlobalSearchParams<{ id: string }>();
  const { top  } = useSafeAreaInsets();
  const { rest } = directusStore();

  const fields = ['*', 'company.*', 'document.*'].join(',');
  const { data } = useQuery({
    queryKey: ['Fetch Profile Data', params.id],
    queryFn: async () => {
      const token = await rest.getToken();
      return fetch(`${directusUrl}/users/${params.id}/?fields=${fields}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.data);
    },
    enabled: !!params.id,
  });

  return data ? (
    <ScrollView
      contentContainerStyle={{ paddingTop: top }}
    >
      <ProfileScreen user={data} />
    </ScrollView>
  ) : (
    <></>
  );
}
