import { createItem } from "@directus/sdk";
import { Asset, withId, withUri } from "app/components/chat-ui";
import { AutoCompleteRenderItemProps, FormAutoSelect, FormInput, FormSelect, RenderRoomTileProps } from "app/components/formComponents";
import { FullWidthImage } from "app/components/full-width-image";
import { Header } from "app/components/header";
import { MaterialSymbolIcon } from "app/components/material-symbol-icon";
import { SeparatorText } from "app/components/separator-text";
import { Switch } from "app/components/switch";
import { Button } from "app/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "app/components/ui/dialog";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { ScrollView } from "app/components/utils/virtual-lists";
import { useColorScheme } from "app/hooks/color-scheme";
import { listingsFolderId } from "app/lib/constants";
import { uploadFileToDirectus } from "app/lib/file-upload";
import { buildAssetUrl, groupByN, pickImages } from "app/lib/helpers";
import { DetailedAmenity } from "app/lib/props";
import { Amenity, Listing } from "app/lib/types";
import { cn } from "app/lib/utils";
import directusStore from "app/store/directus";
import userStore from "app/store/user";
import commaNumber from "comma-number";
import { Formik, FormikProps } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { NavigationState, Route, SceneMap, TabView } from "react-native-tab-view";
import { useSearchParams } from "solito/navigation";
import { useRouter } from "app/hooks/router";
import * as Yup from "yup";
import LockedScreen, { GoToAccountConsole } from "./locked-screens";
import PostImg from "app/assets/locked-screens/post.jpg";
import { CircleAlert, Plus } from "app/components/icons";

function Form1({ formValues, setFormValues, setNavigationState }: { formValues: Form1Values, setFormValues: Dispatch<SetStateAction<Form1Values>>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>> }) {
    const Form1Schema = Yup.object().shape({
        title: Yup.string().
            min(10)
            .max(50)
            .required("Title is required"),
        description: Yup.string()
            .min(50)
            .max(500)
            .required("Description is required"),
        deal_type: Yup.string(),
        budget: Yup.number()
            .when("deal_type", ([deal_type]) => {
                if (deal_type === "buy" || deal_type === "take on rent") {
                    return Yup.number()
                        .required("Budget is required")
                        .typeError("Budget must be a valid number")
                } else {
                    return Yup.number().notRequired()
                }
            })
            .min(0)
            .typeError("Budget must be a valid number"),
        price: Yup.number()
            .when("deal_type", ([deal_type]) => {
                if (deal_type === "sale" || deal_type === "give on rent") {
                    return Yup.number()
                        .required("Price is required")
                        .typeError("Price must be a valid number")
                } else {
                    return Yup.number().notRequired()
                }
            })
            .min(0)
            .typeError("Price must be a valid number"),
        furnishing: Yup.string()
            .when("deal_type", ([deal_type]) => {
                if (deal_type === "give on rent") {
                    return Yup.string().required("Furnishing is required")
                } else {
                    return Yup.string().notRequired()
                }
            })
            .oneOf(["furnished", "semi furnished", "unfurnished"]),
        covered_by_seller: Yup.string()
            .when("deal_type", ([deal_type]) => {
                if (deal_type === "sale") {
                    return Yup.string().required("Covered by seller is required")
                } else {
                    return Yup.string().notRequired()
                }
            })
            .oneOf(["yes", "no", "dependent"]),
        expectedBrokerFees: Yup.number().
            min(0)
            .max(100)
            .required("Expected broker fees is required")
            .typeError("Expected broker fees must be a valid number"),
        location: Yup.object().shape({
            id: Yup.string().required("Location is required"),
        }).nonNullable().required("Location is required"),
        size: Yup.number()
            .min(0)
            .required("Size is required")
            .typeError("Size must be a valid number"),
    })

    const handleSubmit = (values: Form1Values) => {
        setFormValues(values)
        setNavigationState(p => ({ ...p, index: p.index + 1 }))
    }

    const Form = (props: FormikProps<Form1Values>) => {
        const searchParams = useSearchParams()

        const type = searchParams?.get("deal_type")
        console.log(type)

        useEffect(() => {
            if (type === "buy" || type === "take on rent" || type === "sale" || type === "give on rent") {
                props.setFieldValue("deal_type", type)
            }
        }, [type])

        return <ScrollView contentContainerClassName="flex-grow justify-between">
            <View className="flex-col gap-4">
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
                <RenderDealTypeSpecificComponent
                    price={props.values.price}
                    budget={props.values.budget}
                    covered_by_seller={props.values.covered_by_seller}
                    deal_type={props.values.deal_type}
                    errors={props.errors}
                    furnishing={props.values.furnishing}
                    handleBlur={props.handleBlur}
                    setFieldValue={props.setFieldValue}
                    touched={props.touched}
                />
                <FormInput
                    label="Expected Broker Fees (%)"
                    value={props.values.expectedBrokerFees?.toString() ?? ""}
                    onChangeText={props.handleChange("expectedBrokerFees")}
                    onBlur={props.handleBlur("expectedBrokerFees")}
                    keyboardType="number-pad"
                    error={props.touched.expectedBrokerFees ? props.errors.expectedBrokerFees : ""}
                />
                <FormInput
                    label="Size (sq.ft)"
                    value={commaNumber(props.values.size || "")}
                    onChangeText={val => props.setFieldValue("size", parseInt(val.replace(/,/g, "")))}
                    error={props.touched.size ? props.errors.size : ""}
                    keyboardType="number-pad"
                    onBlur={props.handleBlur("size")}
                />
            </View>
            <Button onPress={() => props.handleSubmit()} className="mt-4 mb-0">
                <Text>Next</Text>
            </Button>
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
        tags: Yup.array().of(Yup.string().required("Tag is required")),
        bathrooms: Yup.number().typeError("Bathrooms must be a valid number"),
        bedrooms: Yup.number().typeError("Bedrooms must be a valid number"),
        parking: Yup.number().typeError("Garage must be a valid number"),
    })

    const handleSubmit = (values: Form2Values) => {
        setNavigationState(p => ({ ...p, index: p.index + 1 }))
        setFormValues(values)
    }

    const Form = (props: FormikProps<Form2Values>) => {
        const TagInput = ({ tags, setTags }: { tags: string[], setTags: (newTags: string[]) => void }) => {
            const [currentTag, setCurrentTag] = useState("")
            const [error, setError] = useState("")

            const AddTagButton = () => {
                const handleAddTagPress = () => {
                    if (currentTag) {
                        setTags([...tags, currentTag])
                        setCurrentTag("")
                    } else {
                        setError("fill in a tag")
                    }
                }
                return <Button onPress={handleAddTagPress} className="rounded-full" size={"icon"} variant={"secondary"}>
                    <Plus className="text-secondary-foreground" />
                </Button>
            }
            return <View className="flex-col gap-1">
                <FormInput
                    maxLength={50}
                    label="tags"
                    value={currentTag}
                    onChangeText={val => {
                        setCurrentTag(val)
                        setError("")
                    }}
                    rightComponent={AddTagButton}
                    error={error}
                />
                {tags.length ? <View className="flex-row flex-wrap gap-1">
                    {tags.map((tag, index) => <Button disabled={!Boolean(currentTag) || Boolean(error)} className="self-start bg-secondary" variant={"base"} size={"none"} onPress={() => setTags(tags.filter((t, i) => i !== index))} key={index}>
                        <Text className="text-secondary-foreground text-xs rounded p-1">{tag}</Text>
                    </Button>)}
                </View> : <></>}
            </View>
        }

        const AmenitiesInput = ({ detailedAmenities, setDetailedAmenities }: { detailedAmenities: DetailedAmenity[], setDetailedAmenities: (newDetailedAmenities: DetailedAmenity[]) => void }) => {
            const [currentAmenity, setCurrentAmenity] = useState<Amenity | null>(null)
            const [currentAdditionalDetail, setCurrentAdditionalDetail] = useState("")

            return <View className="flex-col gap-8">
                <RenderAmenities amenities={detailedAmenities} />
                <View className="flex-col gap-4">
                    <FormAutoSelect
                        currentItem={currentAmenity}
                        setCurrentItem={(item) => setCurrentAmenity(item as Amenity)}
                        item="amenities_base"
                        label="Amenity"
                        className="flex-1"
                    />
                    <FormInput
                        label="Additional Detail"
                        value={currentAdditionalDetail}
                        onChangeText={setCurrentAdditionalDetail}
                        className="flex-1"
                        rightComponent={() => <Button disabled={!Boolean(currentAmenity)} onPress={() => {
                            setDetailedAmenities([...detailedAmenities, {
                                amenity: currentAmenity!,
                                additional_detail: currentAdditionalDetail
                            }])
                            setCurrentAdditionalDetail("")
                            setCurrentAmenity(null)
                        }} variant={"secondary"} size={"icon"} className="rounded-full">
                            <Plus className="text-secondary-foreground" />
                        </Button>}
                    />
                </View>
            </View>
        }

        return <ScrollView contentContainerClassName="flex-grow">
            <View className={cn("flex-1 flex-col gap-4 justify-start")}>
                <View className="flex-col gap-4">
                    <Text className="my-4">Optional fields that would boost user interactions</Text>
                    <TagInput tags={props.values.tags} setTags={(newTags: string[]) => props.setFieldValue("tags", newTags)} />
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
                        value={props.values.parking?.toString() ?? ""}
                        onChangeText={props.handleChange("parking")}
                        error={props.touched.parking ? props.errors.parking : ""}
                        keyboardType="number-pad"
                        onBlur={props.handleBlur("parking")}
                    />
                    <SeparatorText wrapperClassName="my-8">
                        <Text className="text-subtext text-sm">Amenities (optional)</Text>
                    </SeparatorText>
                    <AmenitiesInput detailedAmenities={props.values.amenities} setDetailedAmenities={(newDetailedAmenities: DetailedAmenity[]) => props.setFieldValue("amenities", newDetailedAmenities)} />
                </View>
                <View className="mt-auto mb-0 pt-8">
                    <Separator className="my-4" />
                    <View className="flex-row gap-4">
                        <Button className="flex-1" onPress={() => setNavigationState(p => ({ ...p, index: p.index - 1 }))}>
                            <Text>Back</Text>
                        </Button>
                        <Button className="flex-1" onPress={() => props.handleSubmit()}>
                            <Text>Next</Text>
                        </Button>
                    </View>
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

function Form3({ formValues, setFormValues, setNavigationState }: { formValues: Form3Values, setFormValues: Dispatch<SetStateAction<Form3Values>>, setNavigationState: Dispatch<SetStateAction<NavigationState<Route>>> }) {
    const { photo_1, photo_2, photo_3 } = formValues
    const getUrl = (asset: Asset<withUri | withId>) => {
        if ("id" in asset) {
            return buildAssetUrl(asset.id)
        } else return asset.uri
    }

    const setPhoto = async (key: "photo_1" | "photo_2" | "photo_3") => {
        const [asset] = await pickImages({ allowsMultipleSelection: false })
        if (asset) {
            setFormValues(p => ({ ...p, [key]: asset }))
        }
    }

    return <ScrollView contentContainerClassName="flex-col gap-8 flex-grow">
        <View>
            <Text className="text-xl font-semibold">Add images</Text>
            <Text>Adding images would boost agents engagement</Text>
        </View>
        {[
            { label: 'Photo 1', photo: photo_1, key: "photo_1" },
            { label: 'Photo 2', photo: photo_2, key: "photo_2" },
            { label: 'Photo 3', photo: photo_3, key: "photo_3" },
        ].map(({ label, photo, key }, index) => <View className="flex-col gap-4" key={index}>
            <SeparatorText hideLeft>
                <Text>{label}</Text>
            </SeparatorText>
            {photo ? <FullWidthImage source={{ uri: getUrl(photo) }} /> : <></>}
            <View className="flex-row gap-4">
                <Button className="flex-grow" onPress={() => setPhoto(key as any)} variant={"secondary"} size={"sm"}>
                    <Text>{photo ? "upload another" : "upload"}</Text>
                </Button>
                {photo && <Button onPress={() => setFormValues(p => ({ ...p, [key]: null }))} variant={"destructive"} size={"sm"} className="w-1/2">
                    <Text>Remove</Text>
                </Button>}
            </View>
        </View>)}
        <View className="mt-auto mb-0">
            <Separator className="my-4" />
            <View className="flex-row gap-4">
                <Button className="flex-grow" onPress={() => setNavigationState(p => ({ ...p, index: p.index - 1 }))}>
                    <Text>Back</Text>
                </Button>
                <Button className="flex-grow" onPress={() => setNavigationState(p => ({ ...p, index: p.index + 1 }))}>
                    <Text>Next</Text>
                </Button>
            </View>
        </View>
    </ScrollView>
}

function Form4({ formValues, setFormValues, handleSubmit, loading }: { formValues: Form4Values, setFormValues: Dispatch<SetStateAction<Form4Values>>, handleSubmit: () => void, loading: boolean }) {
    const [open, setOpen] = useState(false)
    const { user } = userStore()

    const validationSchema = Yup.object().shape({
        featured: Yup.boolean().required("Option required"),
    })

    const onSubmit = (values: Form4Values) => {
        setFormValues(values)
        handleSubmit()
    }



    const Form = (props: FormikProps<Form4Values>) => {
        return <ScrollView contentContainerClassName="flex-grow">
            <View className="flex-1 flex-col justify-center items-center gap-12">
                <View>
                    <Text>Marking the listings premium have proved reach!</Text>
                    <Button size={"none"} variant={"base"}>
                        <Text className="underline text-info">learn more</Text>
                    </Button>
                </View>
                <Text className={cn(user.premium_quota ? "text-success" : "text-destructive")}>you have {user.premium_quota} premium listing cap available</Text>
                {user.premium_quota ? <View className="flex-row gap-4 items-center">
                    <Text>Mark as premium</Text>
                    <Switch renderActiveText={false} renderInActiveText={false} value={props.values.featured} onValueChange={val => props.setFieldValue("featured", val)} />
                </View> : <></>}
            </View>
            <View className="mt-1/2 mb-4 flex-col items-center gap-4 flex-1 justify-center">
                <CircleAlert className="text-warning" size={32} />
                <Text className="text-center text-warning">The listings you create will be added to a verification queue, where our staff will review and approve them.</Text>
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


function PostScreenComponent() {
    const [form1Values, setForm1Values] = useState<Form1Values>(form1InitialValues)
    const [form2Values, setForm2Values] = useState<Form2Values>(form2InitialValues)
    const [form3Values, setForm3Values] = useState<Form3Values>(form3InitialValues)
    const [form4Values, setForm4Values] = useState<Form4Values>(form4InitialValues)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: "form1" },
            { key: "form2" },
            { key: "form3" },
            { key: "form4" }
        ]
    })
    const { rest, token } = directusStore()

    const handleSubmit = async () => {
        setLoading(true)

        const assets = [form3Values.photo_1, form3Values.photo_2, form3Values.photo_3].filter(asset => asset !== null) as Asset<withUri>[]
        const assetsId = await Promise.all(assets.map(asset => uploadFileToDirectus(asset, listingsFolderId)))

        const payload: Partial<Omit<Listing, "amenities"> & {
            amenities: {
                amenity: Omit<Amenity, "id">,
                additional_detail: string,
            }[]
        }> = {
            deal_type: form1Values.deal_type!,

            title: form1Values.title,
            expected_broker_fees: form1Values.expectedBrokerFees!,
            size: form1Values.size!,
            location: form1Values.location?.id! as string | undefined,
            price: form1Values.price!,
            budget: form1Values.budget!,
            description: form1Values.description,

            tags: form2Values.tags,
            bathrooms: form2Values.bathrooms ?? null,
            bedrooms: form2Values.bedrooms ?? null,
            parking: form2Values.parking ?? null,

            amenities: form2Values.amenities,

            photo_1: assetsId.length > 0 ? assetsId[0] : null,
            photo_2: assetsId.length > 1 ? assetsId[1] : null,
            photo_3: assetsId.length > 2 ? assetsId[2] : null,

            featured: form4Values.featured,
        }
        console.log(payload)
        const res = await rest.request(createItem("listings", payload))
        console.log(res)
        setLoading(false)
        router.back()
    }

    return <View className="flex-1 w-full">
        <Header>
            <Text className="text-xl font-bold">Post</Text>
        </Header>
        <View className="flex-grow p-4 max-w-xl">
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
                        setNavigationState={setNavigationState}
                    />,
                    form4: () => <Form4
                        formValues={form4Values}
                        setFormValues={setForm4Values}
                        handleSubmit={handleSubmit}
                        loading={loading}
                    />
                })}
            />
        </View>
    </View>
}

export default function PostScreen() {
    const { authenticated } = directusStore();
    const { user } = userStore()

    return <View className="flex-1 flex-grow h-full">
        {authenticated ? true ?
            <PostScreenComponent /> : <LockedScreen
                image={PostImg}
                title="Create and manage property listings on A2APoint"
                description="Verification is required before you can begin posting listings on A2A Point!"
                headerTitle="Post"
                bottomComponent={() => <GoToAccountConsole />}
            /> : <LockedScreen
            image={PostImg}
            title="Create and manage property listings on A2APoint"
            description="Access exclusive features to create, update, and manage your property listings."
            headerTitle="Post"
        />}
    </View>
}

const form1InitialValues: Form1Values = {
    title: "",
    description: "",
    budget: null,
    price: null,
    deal_type: "buy",
    furnishing: "furnished",
    covered_by_seller: "dependent",
    address: "",
    expectedBrokerFees: null,
    location: null,
    size: null,
}

const form2InitialValues: Form2Values = {
    tags: [],
    amenities: []
}

const form3InitialValues: Form3Values = {
    photo_1: null,
    photo_2: null,
    photo_3: null
}

const form4InitialValues: Form4Values = {
    featured: false
}

type Form1Values = {
    title: string;
    description: string;
    budget: number | null;
    price: number | null;
    deal_type: "buy" | "take on rent" | "sale" | "give on rent" | null;
    furnishing: "furnished" | "semi furnished" | "unfurnished" | null;
    covered_by_seller: "yes" | "no" | "dependent" | null;
    address: string;
    expectedBrokerFees: number | null;
    location: AutoCompleteRenderItemProps | null;
    size: number | null;
}

type Form2Values = {
    tags: string[];
    amenities: DetailedAmenity[];
    bathrooms?: number;
    bedrooms?: number;
    parking?: number;
}

type Form3Values = {
    photo_1: Asset<withUri | withId> | null;
    photo_2: Asset<withUri | withId> | null;
    photo_3: Asset<withUri | withId> | null;
}

type Form4Values = {
    featured: boolean
}

export const RenderAmenity = ({ amenity, additional_detail }: DetailedAmenity) => {
    const { colors } = useColorScheme()
    const { icon, label } = amenity

    return <View className="w-full border border-border rounded-2xl flex-col gap-4 p-4 bg-card">
        <View className="flex-row gap-4">
            <MaterialSymbolIcon name={icon} fill={colors.info} />
            <Text>{label}</Text>
        </View>
        {additional_detail ? <Text className="text-subtext text-sm">{additional_detail}</Text> : <></>}
    </View>
}

const RenderDealTypeSpecificComponent = ({ deal_type, covered_by_seller, furnishing, budget, price, setFieldValue, handleBlur, touched, errors }: Pick<Form1Values, "deal_type" | "covered_by_seller" | "furnishing" | "budget" | "price"> & {
    setFieldValue: FormikProps<Form1Values>["setFieldValue"],
    handleBlur: FormikProps<Form1Values>["handleBlur"],
    touched: FormikProps<Form1Values>["touched"],
    errors: FormikProps<Form1Values>["errors"]
}) => {
    switch (deal_type) {
        case "sale":
            return <>
                <FormSelect
                    options={["yes", "no", "dependent"].map(val => ({ label: val, value: val }))}
                    label="Covered by seller"
                    value={covered_by_seller ? { value: covered_by_seller, label: covered_by_seller } : undefined}
                    onValueChange={(val) => setFieldValue("covered_by_seller", val?.value)}
                />
                <FormInput
                    label="Price (AED)"
                    value={commaNumber(price || "")}
                    onChangeText={(val) => setFieldValue("price", parseInt(val.replace(/,/g, "")))}
                    error={touched.price ? errors.price : ""}
                    keyboardType="number-pad"
                    onBlur={handleBlur("price")}
                />
            </>
        case "give on rent":
            return <>
                <FormSelect
                    options={["furnished", "semi furnished", "unfurnished"].map(val => ({ label: val, value: val }))}
                    label="Furnishing"
                    value={furnishing ? { value: furnishing, label: furnishing } : undefined}
                    onValueChange={(val) => setFieldValue("furnishing", val?.value)}
                />
                <FormInput
                    label="Price (AED)"
                    value={commaNumber(price || "")}
                    onChangeText={(val) => setFieldValue("price", parseInt(val.replace(/,/g, "")))}
                    error={touched.price ? errors.price : ""}
                    keyboardType="number-pad"
                    onBlur={handleBlur("price")}
                />
            </>
        case "buy":
        case "take on rent":
            return <FormInput
                label="Budget (AED)"
                value={commaNumber(budget || "")}
                onChangeText={(val) => setFieldValue("budget", parseInt(val.replace(/,/g, "")))}
                error={touched.budget ? errors.budget : ""}
                keyboardType="number-pad"
                onBlur={handleBlur("budget")}
            />
        default:
            return <></>
    }
}

export const RenderAmenities = ({ amenities }: { amenities: DetailedAmenity[] }) => {
    return <View className="">
        {groupByN(amenities).map((_amenities, i) => <View key={i} className="flex-row gap-4 w-full">
            {_amenities.map((amenity, j) => <View className="flex-1" key={j}>
                <RenderAmenity {...amenity} />
            </View>)}
        </View>)}
    </View>
}