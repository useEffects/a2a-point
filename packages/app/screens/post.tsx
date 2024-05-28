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

function Form1({ formValues, setFormValues, setNavigationState }: { formValues: Form1Values, setFormValues: Dispatch<SetStateAction<Form1Values>>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>> }) {
    const dealTypeLabels = {
        rent: "Rent",
        buy: "Buy",
        sell: "Sell"
    }

    const typeLabels = {
        listing: "Listing",
        enquiry: "Enquiry"
    }

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
            .required("Price is required"),
        address: Yup.string()
            .min(10)
            .max(100)
            .required("Address is required"),
        dealType: Yup.string()
            .oneOf(["rent", "buy", "sell"])
            .required("Deal type is required"),
        type: Yup.string()
            .oneOf(["listing", "enquiry"])
            .required("Type is required"),
        expectedBrokerFees: Yup.number().min(0).max(100).required("Expected broker fees is required"),
        location: Yup.object().shape({
            id: Yup.string().required("Location is required"),
        })
    })


    const dealTypeOptions = Object.entries(dealTypeLabels).map(([value, label]) => ({ value, label }))
    const typeOptions = Object.entries(typeLabels).map(([value, label]) => ({ value, label }))

    const handleSubmit = (values: Form1Values) => {
        setFormValues(values)
        setNavigationState(p => ({ ...p, index: p.index + 1 }))
    }
    const Form = (props: FormikProps<Form1Values>) => {
        return <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">
            <View className="flex-1 flex-col gap-4">
                <View className="flex-1 flex-col gap-2">
                    <FormInput
                        label="Title"
                        value={props.values.title}
                        onChangeText={props.handleChange("title")}
                        error={props.touched.title ? props.errors.title : ""}
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
                    />
                    <FormInput
                        label="Description"
                        value={props.values.description}
                        onChangeText={props.handleChange("description")}
                        error={props.touched.description ? props.errors.description : ""}
                        maxLines={8}
                    />
                    <FormInput
                        label="Price"
                        value={props.touched.price ? props.values.price.toString() : ""}
                        onChangeText={props.handleChange("price")}
                        error={props.touched.price ? props.errors.price : ""}
                        keyboardType={"number-pad"}
                        className="w-1/2"
                    />
                    <FormInput
                        label="Address"
                        value={props.values.address}
                        onChangeText={props.handleChange("address")}
                        error={props.touched.address ? props.errors.address : ""}
                        maxLines={4}
                    />
                    <FormSelect
                        label="Deal Type"
                        value={{ label: dealTypeLabels[props.values.dealType], value: props.values.dealType }} onValueChange={e => e?.value && props.setFieldValue("dealType", e.value)}
                        options={dealTypeOptions}
                        error={props.touched.dealType ? props.errors.dealType : ""}
                    />
                    <FormSelect
                        label="Type"
                        value={{ label: typeLabels[props.values.type], value: props.values.type }} onValueChange={e => e?.value && props.setFieldValue("type", e.value)}
                        options={typeOptions}
                        error={props.touched.type ? props.errors.type : ""}
                    />
                </View>
                <Button
                    disabled={!props.isValid}
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
        tags: Yup.array()
            .of(Yup.string().min(3).max(20)),
        bathrooms: Yup.number(),
        bedrooms: Yup.number(),
        carpetArea: Yup.number().min(0).required("Carpet area is required"),
        floors: Yup.number(),
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
                    <FormInput
                        label="bathrooms"
                        value={props.values.bathrooms?.toString() ?? ""}
                        onChangeText={props.handleChange("bathrooms")}
                        error={props.touched.bathrooms ? props.errors.bathrooms : ""}
                        keyboardType="number-pad"
                    />
                    <FormInput
                        label="bedrooms"
                        value={props.values.bedrooms?.toString() ?? ""}
                        onChangeText={props.handleChange("bedrooms")}
                        error={props.touched.bedrooms ? props.errors.bedrooms : ""}
                        keyboardType="number-pad"
                    />
                    <FormInput
                        label="garage"
                        value={props.values.garage?.toString() ?? ""}
                        onChangeText={props.handleChange("garage")}
                        error={props.touched.garage ? props.errors.garage : ""}
                        keyboardType="number-pad"
                    />
                    <FormInput
                        label="floors"
                        value={props.values.floors?.toString() ?? ""}
                        onChangeText={props.handleChange("floors")}
                        error={props.touched.floors ? props.errors.floors : ""}
                        keyboardType="number-pad"
                    />
                    <FormInput
                        label="carpet area"
                        value={props.values.carpetArea?.toString() ?? ""}
                        onChangeText={props.handleChange("carpetArea")}
                        error={props.touched.carpetArea ? props.errors.carpetArea : ""}
                        keyboardType="number-pad"
                    />
                </View>
                <View className="flex-row gap-4">
                    <Button className="flex-1" onPress={() => setNavigationState(p => ({ ...p, index: p.index - 1 }))}>
                        <Text>Back</Text>
                    </Button>
                    <Button disabled={!props.isValid} className="flex-1" onPress={() => props.handleSubmit()}>
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

function Form3({ formValues, setFormValues, handleSubmit }: { formValues: Form3Values, setFormValues: Dispatch<SetStateAction<Form3Values>>, handleSubmit: () => void }) {
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
                    <Switch checked={props.values.featured} onCheckedChange={(val) => props.setFieldValue("featured", val)} />
                </View>
            </View>
            <Button onPress={() => props.handleSubmit()}>
                <Text>Create listing</Text>
            </Button>
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
    const [form1Values, setForm1Values] = useState<Form1Values>(form1InitialValues)
    const [form2Values, setForm2Values] = useState<Form2Values>(form2InitialValues)
    const [form3Values, setForm3Values] = useState<Form3Values>(form3InitialValues)

    const { rest } = directusStore()

    const handleSubmit = async () => {
        const payload: Partial<Listing> = {
            address: form1Values.address,
            bathrooms: form2Values.bathrooms ?? null,
            bedrooms: form2Values.bedrooms ?? null,
            floors: form2Values.floors ?? null,
            garages: form2Values.garage ?? null,
            carpet_area: form2Values.carpetArea,
            deal_type: form1Values.dealType,
            description: form1Values.description,
            expected_broker_fees: form1Values.expectedBrokerFees,
            featured: form3Values.featured,
            location: form1Values.location?.id!,
            price: form1Values.price,
            title: form1Values.title,
            type: form1Values.type,
            tags: form1Values.tags
        }
        await rest.request(createItem("listings", payload))

    }

    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 2,
        routes: [
            { key: "form1" },
            { key: "form2" },
            { key: "form3" }
        ]
    })

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
                />
            })}
        />
    </View>
}

const form1InitialValues: Form1Values = {
    title: "",
    description: "",
    price: 0,
    address: "",
    dealType: "buy",
    type: "listing",
    tags: [],
    expectedBrokerFees: 0,
    location: null
}

const form2InitialValues: Form2Values = {
    tags: [],
    carpetArea: 0
}

const form3InitialValues: Form3Values = {
    featured: false
}

type Form1Values = {
    title: string;
    description: string;
    price: number;
    address: string;
    dealType: "rent" | "buy" | "sell";
    type: "listing" | "enquiry";
    tags: string[];
    expectedBrokerFees: number;
    location: AutoCompleteRenderItemProps | null
}

type Form2Values = {
    tags?: string[];
    bathrooms?: number;
    bedrooms?: number;
    carpetArea: number;
    floors?: number;
    garage?: number;
}

type Form3Values = {
    featured: boolean
}

const DownButton = ({ navigationState, setNavigationState, onSubmit }: { navigationState: NavigationState<Route>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>>, onSubmit: () => void }) => {
    const goNext = () => setNavigationState(p => ({ ...p, index: p.index + 1 }))
    const goBack = () => setNavigationState(p => ({ ...p, index: p.index - 1 }))

    if (navigationState.index === navigationState.routes.length - 1) {
        return <Button onPress={onSubmit}>
            <Text>Submit</Text>
        </Button>
    }
    else if (navigationState.index === 0) {
        return <Button onPress={goNext}>
            <Text>Next</Text>
        </Button>
    } else {
        return <View className="flex-row gap-4">
            <Button onPress={goBack} className="flex-1">
                <Text>Back</Text>
            </Button>
            <Button onPress={goNext} className="flex-1">
                <Text>Next</Text>
            </Button>
        </View>
    }
}