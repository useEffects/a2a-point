import { useUserDetails } from 'app/hooks/user-details';
import { useQuery } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { readItem } from '@directus/sdk';
import { Feedback } from 'app/lib/types';
import PostFeedbackScreen from 'app/screens/post-feedback';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalSearchParams } from 'app/context/router';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PostFeedback() {
  const { feedbackId } = useLocalSearchParams();
  const { rest } = directusStore();
  const { agent } = useGlobalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const user = useUserDetails(agent as string);

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
    <ScrollView
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <PostFeedbackScreen user={user} feedback={feedback} />
    </ScrollView>
  ) : (
    <></>
  );
}
