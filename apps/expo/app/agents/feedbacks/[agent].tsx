import { useUserDetails } from "app/hooks/user-details";
import { useParams } from "solito/navigation";
import { useQuery } from "@tanstack/react-query";
import directusStore from "app/store/directus";
import { readItem } from "@directus/sdk";
import { Feedback } from "app/lib/types";
import PostFeedbackScreen from "app/screens/post-feedback";
import { useLocalSearchParams } from "expo-router";
import PadBottom from "../../../components/pad-bottom";
import { View } from "react-native";
import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";

export default function PostFeedback() {
    const { feedbackId } = useLocalSearchParams()
    const { rest } = directusStore()
    const { agent } = useParams()
    const user = useUserDetails(agent as string)

    const { data: feedback } = useQuery({
        queryKey: ["Fetch Feedback", feedbackId],
        queryFn: async () => await rest.request(readItem("feedbacks", feedbackId as string, {
            fields: ["*"]
        })) as Feedback
    })

    return <View>
        <Header>
            <Text>Hello world</Text>
        </Header>
    </View>

    // return user ?
    //     <PadBottom>
    //         <PostFeedbackScreen user={user} feedback={feedback} />
    //     </PadBottom>
    //     : <></>
}