import { useEffect } from "react";
import { useParams } from "solito/navigation";
import useNavigation from "app/hooks/navigation";
import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import { PostFeedback as PostFeedbackComponent } from "app/components/post-feedback"

export default function PostFeedback() {
    const params = useParams<{ id: string }>()
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            header: () => <Header>
                <Text className="text-xl font-bold">Give Feedback</Text>
            </Header>
        })
    }, [navigation])

    return <PostFeedbackComponent userId={params.id} />
}