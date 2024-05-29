import { cn } from "app/lib/utils";
import { Formik, FormikProps } from "formik";
import { Image, ScrollView, View } from "react-native";
import * as Yup from "yup";
import { AutoCompleteRenderItemProps, FormAutoSelect, FormInput, FormSelect, RenderRoomTileProps } from "./formComponents";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { NavigationState, Route, SceneMap, SceneRendererProps, TabView } from "react-native-tab-view";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import directusStore from "app/store/directus";
import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { Room } from "app/lib/types";
import { useColorScheme } from "app/hooks/color-scheme";

function Form1({ initialValues = form1InitialValues }: { initialValues?: Form1Values }) {
    const { rest } = directusStore()
    const { colors } = useColorScheme()

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
            id: Yup.number().required("Location is required"),
        })
    })

    const onSubmit = (values: Form1Values) => {
        console.log(values, "here1")
    }
    const dealTypeOptions = Object.entries(dealTypeLabels).map(([value, label]) => ({ value, label }))
    const typeOptions = Object.entries(typeLabels).map(([value, label]) => ({ value, label }))

    const Form = (props: FormikProps<Form1Values>) => {
        return <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">
            <View className="flex-1 flex-col gap-4 px-4">
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
        </ScrollView>
    }
    return <Formik onSubmit={onSubmit} validationSchema={Form1Schema} initialValues={initialValues}>
        {(props) => <Form {...props} />}
    </Formik>
}

function Form2({ className, initialValues = form2InitialValues }: { initialValues?: Form2Values, className?: string }) {
    const Form2Schema = Yup.object().shape({
        tags: Yup.array()
            .of(Yup.string().min(3).max(20)),
        bathrooms: Yup.number(),
        bedrooms: Yup.number(),
        carpetArea: Yup.number().min(0).required("Carpet area is required"),
        floors: Yup.number(),
        garage: Yup.number(),
    })
    const onSubmit = (values: Form2Values) => {
        console.log(values, "here2")
    }
    const Form = (props: FormikProps<Form2Values>) => {
        return <ScrollView contentContainerClassName="flex-grow">
            <View className={cn("flex-1 flex-col gap-4 justify-start", className)}>
                <Text>Optional fields that would boost user interactions</Text>
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
            </View>
        </ScrollView>
    }

    return <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={Form2Schema}
    >
        {(props) => <Form {...props} />}
    </Formik>

}

function Form3({ initialValues = { featured: false } }: { initialValues?: { featured: boolean } }) {
    const validationSchema = Yup.object().shape({
        featured: Yup.boolean().required("Option required"),
    })
    type Form3Values = {
        featured: boolean
    }
    const onSubmit = (values: Form3Values) => {
        console.log(values, "here3")
    }

    const Form = (props: FormikProps<Form3Values>) => {
        return <ScrollView contentContainerClassName="flex-grow">
            <View className="flex-1">
            </View>
        </ScrollView>
    }

    return <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
        {(props) => <Form {...props} />}
    </Formik>
}


export default function PostListing() {
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: "form1" },
            { key: "form2" },
            { key: "form3" }
        ]
    })

    const onSubmit = () => { }

    return <View className="flex-1 w-full flex-col gap-4">
        <TabView
            swipeEnabled={false}
            renderTabBar={() => null}
            navigationState={navigationState}
            onIndexChange={index => setNavigationState({ ...navigationState, index })}
            renderScene={SceneMap({
                form1: () => <Form1 />,
                form2: () => <Form2 />,
                form3: () => <Form3 />
            })}
        />
        <View className="mb-0 mt-auto flex-col justify-end mt-4">
            <DownButton navigationState={navigationState} setNavigationState={setNavigationState} onSubmit={onSubmit} />
        </View>
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
    carpetArea: 0,
    expectedBrokerFees: 0,
    location: null
}

const form2InitialValues: Form2Values = {
    tags: [],
}

type Form1Values = {
    title: string;
    description: string;
    price: number;
    address: string;
    dealType: "rent" | "buy" | "sell";
    type: "listing" | "enquiry";
    tags: string[];
    bathrooms?: number;
    bedrooms?: number;
    carpetArea?: number;
    floors?: number;
    garage?: number;
    expectedBrokerFees?: number;
    location: AutoCompleteRenderItemProps | null
}

type Form2Values = {
    tags?: string[];
    bathrooms?: number;
    bedrooms?: number;
    carpetArea?: number;
    floors?: number;
    garage?: number;
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

const LocationsFlatList = () => {

}