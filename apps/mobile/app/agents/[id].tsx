import { useQuery } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { directusUrl } from 'app/lib/constants';
import { ProfileScreen, ProfileScreenHeader } from 'app/screens/profile';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

function ProfileDetailedScreenComponent() {
  const params = useGlobalSearchParams<{ id: string }>();
  const { rest } = directusStore();
  const navigation = useNavigation();

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

  useEffect(() => {
    data &&
      navigation.setOptions({
        header: () => <ProfileScreenHeader user={data} />,
      });
  }, [navigation, data]);

  return data ? (
    <ScrollView>
      <ProfileScreen user={data} />
    </ScrollView>
  ) : (
    <></>
  );
}

export default function ProfileDetailedScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Agent"
        component={ProfileDetailedScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
