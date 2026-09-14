import { useUserDetails } from 'app/hooks/user-details';
import { useQuery } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { readItem } from '@directus/sdk';
import { Feedback } from 'app/lib/types';
import {
  PostFeedbackScreen as PostFeedbackScreenBase,
  PostFeedbackScreenHeader,
} from 'app/screens/post-feedback';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalSearchParams } from 'app/context/router';
import { Stacked } from '../../../components/stacked';

export default function PostFeedbackScreenComponent() {
  const { feedbackId } = useLocalSearchParams();
  const { rest } = directusStore();
  const { agent } = useGlobalSearchParams();
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
    <Stacked
      header={() => <PostFeedbackScreenHeader feedback={Boolean(feedbackId)} />}
    >
      <PostFeedbackScreenBase user={user} feedback={feedback} />
    </Stacked>
  ) : (
    <></>
  );
}
