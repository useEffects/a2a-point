import { useColorScheme } from "app/hooks/color-scheme";
import { useUserDetails } from "app/hooks/user-details";
import { buildAssetUrl } from "app/lib/helpers";
import { Formik, FormikProps } from "formik";
import { Star, StarHalf } from "lucide-react-native";
import { Image, View } from "react-native";
import StarRating, { StarIconProps } from "react-native-star-rating-widget";
import * as Yup from 'yup';
import { FormInput } from "./formComponents";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

const StarIcon = (props: StarIconProps) => {
    const { colors } = useColorScheme()

    if (props.type === "full") {
        return <Button variant={"base"} size={"none"}>
            <Star {...props} fill={colors.primary} color={colors.primary} />
        </Button>
    } else if (props.type === "half") {
        return <Button variant={"base"} size={"none"}>
            <StarHalf {...props} color={colors.primary} fill={colors.primary} />
        </Button>
    } else {
        return <Button variant={"base"} size={"none"}>
            <Star {...props} color={colors.subtext} />
        </Button>
    }
}

type FeedbackValues = {
    rating: number
    feedback: string
}

const initialFeedbackValues = {
    rating: 0,
    feedback: ""
}

export function PostFeedback({ userId }: { userId: string }) {
    const user = useUserDetails(userId)

    const Form = (props: FormikProps<FeedbackValues>) => {
        return <View className="flex-col gap-4 items-start flex-1 w-full">
            <StarRating
                rating={props.values.rating}
                onChange={(_rating: number) => {
                    props.setFieldValue("rating", _rating)
                }}
                StarIconComponent={(props: StarIconProps) => <StarIcon {...props} size={18} />}
            />
            <FormInput
                value={props.values.feedback}
                onChangeText={props.handleChange("feedback")}
                onBlur={props.handleBlur("feedback")}
                error={props.errors.feedback}
                label="Feedback"
                multiline
                className="w-full"
            />
            <Button className="" onPress={props.submitForm}>
                <Text>Submit</Text>
            </Button>
        </View>
    }

    return <View className="flex-1">
        <Image source={{ uri: buildAssetUrl(user?.avatar) }} className="w-20 h-20 rounded-full my-4" />
        <Formik
            initialValues={initialFeedbackValues}
            validationSchema={FeedbackSchema}
            onSubmit={(values) => {
                console.log(values)
            }}>
            {(props) => <Form {...props} />}
        </Formik>
    </View>
}

const FeedbackSchema = Yup.object().shape({
    rating: Yup.number()
        .min(0)
        .max(5)
        .required("Rating is required"),
    feedback: Yup.string()
        .min(10)
        .max(250)
        .required("Feedback is required")
})
