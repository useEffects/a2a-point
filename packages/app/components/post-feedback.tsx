import { useUserDetails } from "app/hooks/user-details"
import { View } from "react-native"
import StarRating from "react-native-star-rating-widget"
import * as Yup from 'yup';
import { Star, StarHalf } from "lucide-react-native"
import { StarIconProps } from "react-native-star-rating-widget";
import { Button } from "./ui/button";
import { useColorScheme } from "app/hooks/color-scheme";
import { useEffect, useState } from "react";
import { Formik, FormikProps } from "formik";
import { OutlinedTextField as TextField } from "react-native-material-textfield";

const StarIcon = (props: StarIconProps) => {
    const { colors } = useColorScheme()

    if (props.type === "full") {
        return <Button variant={"base"} size={"none"}>
            <Star {...props} />
        </Button>
    } else {
        return <Button variant={"base"} size={"none"}>
            <StarHalf {...props} />
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
    const [rating, setRating] = useState(initialFeedbackValues.rating)
    const { colors } = useColorScheme()
    const [color, setColor] = useState("")

    useEffect(() => {
        if (rating < 3) {
            setColor(colors.destructive)
        } else if (rating < 4) {
            setColor(colors.info)
        } else {
            setColor(colors.success)
        }
    }, [rating, colors])

    const Form = (props: FormikProps<FeedbackValues>) => {
        return <View className="flex-col gap-4">
            <StarRating
                rating={rating}
                onChange={setRating}
                StarIconComponent={StarIcon}
            />
            <TextField
                value={props.values.feedback}
                onChangeText={props.handleChange("feedback")}
                onBlur={props.handleBlur("feedback")}
                error={props.errors.feedback}
                label="Feedback"
                multiline
                title={props.errors.feedback}
            />
        </View>
    }

    return <View className="flex-1">
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
        .min(1)
        .max(5)
        .required("Rating is required"),
    feedback: Yup.string()
        .min(10)
        .max(250)
        .required("Feedback is required")
})
