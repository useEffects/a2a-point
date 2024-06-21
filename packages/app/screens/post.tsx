import { cn } from "app/lib/utils";
import { Formik, FormikProps } from "formik";
import { Image, ScrollView, View } from "react-native";
import * as Yup from "yup";
import { AutoCompleteRenderItemProps, FormAutoSelect, FormInput, FormSelect, RenderRoomTileProps } from "app/components/formComponents";
import { Button } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import { NavigationState, Route, SceneMap, SceneRendererProps, TabView } from "react-native-tab-view";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import directusStore from "app/store/directus";
import { Switch } from "app/components/ui/switch";
import { createItem } from "@directus/sdk";
import { Listing } from "app/lib/types";
import commaNumber from "comma-number";
import { useParams } from "solito/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogClose, DialogTitle } from "app/components/ui/dialog";
import { useRouter } from "solito/navigation";

function Form1({ formValues, setFormValues, setNavigationState }: { formValues: Form1Values, setFormValues: Dispatch<SetStateAction<Form1Values>>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>> }) {
    const params = useParams()
    const dealTypeLabels = {
        "give on rent": "Give on rent",
        "take on rent": "Take on rent",
    }

    const shouldShowDealType = params.type === "rent"

    const Form1Schema = Yup.object().shape({
        title: Yup.string().
            min(10)
            .max(50)
            .required("Title is required"),
        description: Yup.string()
            .min(50)
            .max(500)
            .required("Description is required"),
        price: Yup.number()
            .min(0)
            .typeError("Price must be a valid number")
            .required("Price is required"),
        dealType: Yup.string()
            .oneOf(["give on rent", "take on rent"])
            .required("Deal type is required"),
        expectedBrokerFees: Yup.number().
            min(0)
            .max(100)
            .required("Expected broker fees is required")
            .typeError("Expected broker fees must be a valid number"),
        location: Yup.object().shape({
            id: Yup.string().required("Location is required"),
        }).nonNullable("Location is required")
    })


    const dealTypeOptions = Object.entries(dealTypeLabels).map(([value, label]) => ({ value, label }))

    const handleSubmit = (values: Form1Values) => {
        setFormValues(values)
        setNavigationState(p => ({ ...p, index: p.index + 1 }))
    }
    const Form = (props: FormikProps<Form1Values>) => {
        return <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">
            <View className="flex-1 flex-col gap-4">
                <View className="flex-1 flex-col gap-4">
                    <FormInput
                        label="Title"
                        value={props.values.title}
                        onChangeText={props.handleChange("title")}
                        error={props.touched.title ? props.errors.title : ""}
                        onBlur={props.handleBlur("title")}
                    />
                    <FormAutoSelect
                        currentItem={props.values.location as RenderRoomTileProps}
                        setCurrentItem={(item) => props.setFieldValue("location", item)}
                        label="Location"
                        error={props.touched.location ? props.errors.location : ""}
                        item="rooms"
                        filter={{
                            type: {
                                _eq: "group"
                            }
                        }}
                        onBlur={props.handleBlur("location")}
                    />
                    <FormInput
                        label="Description"
                        value={props.values.description}
                        onChangeText={props.handleChange("description")}
                        error={props.touched.description ? props.errors.description : ""}
                        maxLines={8}
                        onBlur={props.handleBlur("description")}
                    />
                    <FormInput
                        label="Price (AED)"
                        value={commaNumber(props.values.price || "")}
                        onChangeText={(val) => props.setFieldValue("price", parseInt(val.replace(/,/g, "")))}
                        error={props.touched.price ? props.errors.price : ""}
                        keyboardType={"number-pad"}
                        className="w-1/2"
                        onBlur={props.handleBlur("price")}
                    />
                    <FormInput
                        label="Expected Broker Fees (%)"
                        value={props.values.expectedBrokerFees?.toString() ?? ""}
                        onChangeText={props.handleChange("expectedBrokerFees")}
                        onBlur={props.handleBlur("expectedBrokerFees")}
                        keyboardType="number-pad"
                        error={props.touched.expectedBrokerFees ? props.errors.expectedBrokerFees : ""}
                    />
                    {shouldShowDealType && <FormSelect
                        label="Deal Type"
                        value={{ label: dealTypeLabels[props.values.dealType], value: props.values.dealType }} onValueChange={e => e?.value && props.setFieldValue("dealType", e.value)}
                        options={dealTypeOptions}
                        error={props.touched.dealType ? props.errors.dealType : ""}
                    />}
                    <FormInput
                        label="Size (sq.ft)"
                        value={commaNumber(props.values.size || "")}
                        onChangeText={val => props.setFieldValue("size", parseInt(val.replace(/,/g, "")))}
                        error={props.touched.size ? props.errors.size : ""}
                        keyboardType="number-pad"
                        onBlur={props.handleBlur("size")}
                    />
                </View>
                <Button
                    onPress={() => props.handleSubmit()}
                >
                    <Text>Next</Text>
                </Button>
            </View>
        </ScrollView>
    }
    return <Formik
        onSubmit={handleSubmit}
        validationSchema={Form1Schema}
        initialValues={formValues}
        validateOnMount
    >
        {(props) => <Form {...props} />}
    </Formik>
}

function Form2({ formValues, setFormValues, setNavigationState }: { formValues: Form2Values, setFormValues: Dispatch<SetStateAction<Form2Values>>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>> }) {
    const Form2Schema = Yup.object().shape({
        tags: Yup.string(),
        bathrooms: Yup.number(),
        bedrooms: Yup.number(),
        garage: Yup.number(),
    })

    const handleSubmit = (values: Form2Values) => {
        setNavigationState(p => ({ ...p, index: p.index + 1 }))
        setFormValues(values)
    }

    const Form = (props: FormikProps<Form2Values>) => {
        console.log(props.errors)
        return <ScrollView contentContainerClassName="flex-grow">
            <View className={cn("flex-1 flex-col gap-4 justify-start")}>
                <View className="flex-1 flex-col gap-2">
                    <Text className="my-4">Optional fields that would boost user interactions</Text>
                    <View className="flex-col gap-1">
                        <FormInput
                            label="tags"
                            value={props.values.tags ?? ""}
                            onChangeText={props.handleChange("tags")}
                            error={props.touched.tags ? props.errors.tags : ""}
                            onBlur={props.handleBlur("tags")}
                        />
                        {(props.values.tags && props.values.tags?.split(",").length) && <View className="flex-row gap-1">
                            {props.values.tags.split(",").map((tag, i) => <Text className="text-info bg-info/10 text-xs px-1" key={i}>{tag}</Text>)}
                        </View>}
                    </View>
                    <FormInput
                        label="bathrooms"
                        value={props.values.bathrooms?.toString() ?? ""}
                        onChangeText={props.handleChange("bathrooms")}
                        error={props.touched.bathrooms ? props.errors.bathrooms : ""}
                        keyboardType="number-pad"
                        onBlur={props.handleBlur("bathrooms")}
                    />
                    <FormInput
                        label="bedrooms"
                        value={props.values.bedrooms?.toString() ?? ""}
                        onChangeText={props.handleChange("bedrooms")}
                        error={props.touched.bedrooms ? props.errors.bedrooms : ""}
                        keyboardType="number-pad"
                        onBlur={props.handleBlur("bedrooms")}
                    />
                    <FormInput
                        label="parking"
                        value={props.values.garage?.toString() ?? ""}
                        onChangeText={props.handleChange("garage")}
                        error={props.touched.garage ? props.errors.garage : ""}
                        keyboardType="number-pad"
                        onBlur={props.handleBlur("garage")}
                    />
                </View>
                <View className="flex-row gap-4">
                    <Button className="flex-1" onPress={() => setNavigationState(p => ({ ...p, index: p.index - 1 }))}>
                        <Text>Back</Text>
                    </Button>
                    <Button className="flex-1" onPress={() => props.handleSubmit()}>
                        <Text>Next</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    }

    return <Formik
        initialValues={formValues}
        onSubmit={handleSubmit}
        validationSchema={Form2Schema}
        enableReinitialize
        validateOnMount
    >
        {(props) => <Form {...props} />}
    </Formik>

}

function Form3({ formValues, setFormValues, handleSubmit, loading }: { formValues: Form3Values, setFormValues: Dispatch<SetStateAction<Form3Values>>, handleSubmit: () => void, loading: boolean }) {
    const [open, setOpen] = useState(false)
    const validationSchema = Yup.object().shape({
        featured: Yup.boolean().required("Option required"),
    })

    const onSubmit = (values: Form3Values) => {
        setFormValues(values)
        handleSubmit()
    }

    const Form = (props: FormikProps<Form3Values>) => {
        return <ScrollView contentContainerClassName="flex-grow">
            <View className="flex-1 flex-col justify-center items-center gap-12">
                <View>
                    <Text>Marking the listings premium have proved reach!</Text>
                    <Button size={"none"} variant={"base"}>
                        <Text className="underline text-info">learn more</Text>
                    </Button>
                </View>
                <View className="flex-row gap-4 items-center">
                    <Text>Mark as premium</Text>
                    <Switch checked={props.values.featured} onCheckedChange={(val) => {
                        props.setFieldValue("featured", val)
                    }} />
                </View>
            </View>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button disabled={loading}>
                        <Text>Create listing</Text>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmation required</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to create this listing?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <View className="flex-row items-center justify-end gap-4">
                                <Button onPress={() => setOpen(false)} size={"sm"} variant={"outline"}>
                                    <Text>Cancel</Text>
                                </Button>
                                <Button onPress={() => props.handleSubmit()} size={"sm"}>
                                    <Text>Confirm</Text>
                                </Button>
                            </View>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ScrollView>
    }

    return <Formik
        validationSchema={validationSchema}
        initialValues={formValues}
        onSubmit={onSubmit}
        validateOnMount
    >
        {(props) => <Form {...props} />}
    </Formik>
}


export default function PostScreenComponent() {
    const params = useParams()
    const [form1Values, setForm1Values] = useState<Form1Values>(form1InitialValues)
    const [form2Values, setForm2Values] = useState<Form2Values>(form2InitialValues)
    const [form3Values, setForm3Values] = useState<Form3Values>(form3InitialValues)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: "form1" },
            { key: "form2" },
            { key: "form3" }
        ]
    })
    const { rest } = directusStore()


    const handleSubmit = async () => {
        setLoading(true)
        const payload: Partial<Listing> = {
            bathrooms: form2Values.bathrooms ?? null,
            bedrooms: form2Values.bedrooms ?? null,
            garages: form2Values.garage ?? null,
            carpet_area: form1Values.size!,
            deal_type: params.key?.toString() ?? form1Values.dealType,
            description: form1Values.description,
            expected_broker_fees: form1Values.expectedBrokerFees!,
            featured: form3Values.featured,
            group: form1Values.location?.id!,
            price: form1Values.price!,
            title: form1Values.title,
            tags: form2Values.tags?.split(",") ?? [],
        }
        await rest.request(createItem("listings", payload))
        setLoading(false)
        router.back()
    }


    return <View className="flex-1 w-full flex-col gap-4">
        <TabView
            swipeEnabled={false}
            renderTabBar={() => null}
            navigationState={navigationState}
            onIndexChange={index => setNavigationState({ ...navigationState, index })}
            renderScene={SceneMap({
                form1: () => <Form1
                    formValues={form1Values}
                    setFormValues={setForm1Values}
                    setNavigationState={setNavigationState}
                />,
                form2: () => <Form2
                    formValues={form2Values}
                    setFormValues={setForm2Values}
                    setNavigationState={setNavigationState}
                />,
                form3: () => <Form3
                    formValues={form3Values}
                    setFormValues={setForm3Values}
                    handleSubmit={handleSubmit}
                    loading={loading}
                />
            })}
        />
    </View>
}

const form1InitialValues: Form1Values = {
    title: "",
    description: "",
    price: null,
    address: "",
    dealType: "give on rent",
    expectedBrokerFees: null,
    location: null,
    size: null
}

const form2InitialValues: Form2Values = {
    tags: "",
}

const form3InitialValues: Form3Values = {
    featured: false
}

type Form1Values = {
    title: string;
    description: string;
    price: number | null;
    address: string;
    dealType: "give on rent" | "take on rent";
    expectedBrokerFees: number | null;
    location: AutoCompleteRenderItemProps | null;
    size: number | null;
}

type Form2Values = {
    tags?: string;
    bathrooms?: number;
    bedrooms?: number;
    garage?: number;
}

type Form3Values = {
    featured: boolean
}