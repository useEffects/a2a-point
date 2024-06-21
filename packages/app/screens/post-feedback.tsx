import { useColorScheme } from "app/hooks/color-scheme";
import { useUserDetails } from "app/hooks/user-details";
import { buildAssetUrl, wordCount } from "app/lib/helpers";
import { Formik, FormikProps } from "formik";
import { Star, StarHalf } from "lucide-react-native";
import { Image, View } from "react-native";
import StarRating, { StarIconProps } from "react-native-star-rating-widget";
import * as Yup from 'yup';
import { FormInput } from "app/components/formComponents";
import { Button } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import { Feedback } from "app/lib/types";
import directusStore from "app/store/directus";
import { createItem, updateItem } from "@directus/sdk";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "app/components/ui/dialog"
import { useRouter } from "solito/navigation";

export const StarIcon = (props: StarIconProps) => {
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
    content: string
}

export function PostFeedback({ userId, feedback }: { userId: string, feedback?: Feedback }) {
    const user = useUserDetails(userId)
    const { rest } = directusStore()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async (values: FeedbackValues) => {
        async function _handleSubmit() {
            setLoading(true)
            if (feedback) {
                return await rest.request(updateItem("feedbacks", feedback.id, {
                    ...values
                }))
            } else {
                return await rest.request(createItem("feedbacks", {
                    ...values,
                    agent: userId
                }))
            }
        }
        _handleSubmit().then(() => {
            setLoading(false)
            router.back()
        })
    }

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
                initialHeight={feedback ? "auto" : undefined}
                value={props.values.content}
                onChangeText={props.handleChange("content")}
                onBlur={props.handleBlur("content")}
                error={props.touched.content ? props.errors.content : ""}
                label="Content"
                multiline
                className="w-full"
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button disabled={loading} className="">
                        <Text>Submit</Text>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Feedback</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to submit this feedback?
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <View className="flex-row items-center gap-4 justify-end">
                                <Button onPress={() => setOpen(false)} variant={"outline"} size={"sm"}>
                                    <Text>Cancel</Text>
                                </Button>
                                <Button onPress={() => {
                                    setOpen(false)
                                    props.handleSubmit()
                                }} size={"sm"}>
                                    <Text>Submit</Text>
                                </Button>
                            </View>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </View>
    }

    return <View className="flex-1">
        <Image source={{ uri: buildAssetUrl(user?.avatar!) }} className="w-20 h-20 rounded-full my-4" />
        <Formik
            initialValues={feedback || {
                rating: 0,
                content: ""

            }}
            validationSchema={FeedbackSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {(props) => <Form {...props} />}
        </Formik>
    </View>
}

const FeedbackSchema = Yup.object().shape({
    rating: Yup.number()
        .min(0)
        .max(5)
        .required("Rating is required"),
    content: Yup.string()
        .test(
            'min-words',
            'Feedback must be at least 10 words',
            value => wordCount(value) >= 10
        )
        .test(
            'max-words',
            'Feedback must be at most 100 words',
            value => wordCount(value) <= 100
        )
        .required("Feedback is required")
})
