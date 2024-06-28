import { useUserDetails } from "app/hooks/user-details";
import { useParams } from "solito/navigation";
import { useQuery } from "@tanstack/react-query";
import directusStore from "app/store/directus";
import { readItem } from "@directus/sdk";
import { Feedback } from "app/lib/types";
import PostFeedbackScreen from "app/screens/post-feedback";

export default function PostFeedback() {
    const { id, feedbackId } = useParams<{ id: string, feedbackId?: string }>()
    const user = useUserDetails(id)
    const { rest } = directusStore()

    const { data: feedback } = useQuery({
        queryKey: ["Fetch Feedback", feedbackId],
        queryFn: async () => await rest.request(readItem("feedbacks", feedbackId as string, {
            fields: ["*"]
        })) as Feedback
    })

    return user ? <PostFeedbackScreen user={user} feedback={feedback} /> : <></>
}