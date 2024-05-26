import { useEffect } from "react";
import { useParams } from "solito/navigation";
import useNavigation from "app/hooks/navigation";
import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import { PostFeedback as PostFeedbackComponent } from "app/components/post-feedback";
import { View, ScrollView } from "react-native";
import { useUserDetails } from "app/hooks/user-details";
import { Separator } from "app/components/ui/separator";

export default function PostFeedback() {
    const params = useParams<{ id: string }>();
    const navigation = useNavigation();
    const user = useUserDetails(params.id);

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header>
                    <Text className="text-xl font-bold">Give Feedback for {user?.first_name} {user?.last_name}</Text>
                </Header>
            )
        });
    }, [navigation, user]);

    const guidelines = [
        "Be Honest: Share your genuine experience to help others get a true sense of the agent.",
        "Be Specific: Provide detailed information about your interaction.",
        "Be Respectful: Even if the feedback is critical, maintain a respectful and polite tone."
    ];

    const examples = [
        "Positive Feedback: \"Agent X was very friendly and reliable during our exchange.\"",
        "Constructive Feedback: \"Agent Y could improve by responding more promptly to messages.\""
    ];

    return (
        <ScrollView className="p-4 flex-1 flex-col gap-8">
            <PostFeedbackComponent userId={params.id} />
            <Separator className="my-8" />
            <Text className="text-lg font-medium my-4 mt-0">Share Your Experience</Text>
            <Text className="text-subtext">
                Thank you for sharing your feedback about
                <Text className="text-foreground">
                    {` ${user?.first_name + " " + user?.last_name}`}
                </Text>
                . Your insights help others understand what to expect and make informed decisions.
            </Text>
            <Text className="text-lg font-medium my-4">Guidelines for Feedback</Text>
            {guidelines.map((guideline, index) => (
                <View key={index} className="flex-row items-start gap-2">
                    <Text className="text-lg text-primary">{'\u2022'}</Text>
                    <Text className="text-base flex-shrink text-subtext">
                        {guideline}
                    </Text>
                </View>
            ))}
            <Text className="text-lg font-medium my-4">Examples:</Text>
            {examples.map((example, index) => (
                <View key={index} className="flex-row items-start gap-2">
                    <Text className="text-lg text-subtext">{'\u2022'}</Text>
                    <Text className="text-base flex-shrink text-subtext">
                        {example}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}