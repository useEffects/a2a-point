import { useUserDetails } from 'app/hooks/user-details';
import { useQuery } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { readItem } from '@directus/sdk';
import { Feedback } from 'app/lib/types';
import {
  PostFeedbackScreen as PostFeedbackScreenBase,
  PostFeedbackScreenHeader,
} from 'app/screens/post-feedback';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useGlobalSearchParams } from 'app/context/router';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

function PostFeedbackScreenComponent() {
  const { feedbackId } = useLocalSearchParams();
  const { rest } = directusStore();
  const { agent } = useGlobalSearchParams();
  const user = useUserDetails(agent as string);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <PostFeedbackScreenHeader feedback={Boolean(feedbackId)} />,
    });
  }, [navigation]);

  const { data: feedback } = useQuery({
    queryKey: ['Fetch Feedback', feedbackId],
    queryFn: async () =>
      (await rest.request(
        readItem('feedbacks' as never, feedbackId as string, {
          fields: ['*'],
        }),
      )) as Feedback,
  });

  return user ? (
    <ScrollView>
      <PostFeedbackScreenBase user={user} feedback={feedback} />
    </ScrollView>
  ) : (
    <></>
  );
}

export default function PostFeedbackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Post Feedback"
        component={PostFeedbackScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
