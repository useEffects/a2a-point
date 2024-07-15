import { createItem } from "@directus/sdk"
import { Check, Clock, File as FileIcon, Image as ImageIcon, Paperclip, Send, FileLock2, X } from 'app/components/icons'
import { Separator } from 'app/components/ui/separator'
import { useColorScheme } from "app/hooks/color-scheme"
import { portfolioUrl } from 'app/lib/constants'
import { shortTime } from 'app/lib/helpers'
import { Message, User } from "app/lib/types"
import { cn } from "app/lib/utils"
import directusStore from 'app/store/directus'
import userStore from 'app/store/user'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from "expo-image-picker"
import * as Linking from "expo-linking"
import { Formik, FormikProps } from 'formik'
import { Dispatch, SetStateAction, use, useEffect, useMemo, useRef, useState } from "react"
import { SectionList, SectionListProps, View } from "react-native"
import Autolink from 'react-native-autolink'
import * as Yup from "yup"
import BottomSheet from './bottomsheet'
import { FormAutoSelect, FormInput, RenderListingTileProps } from './formComponents'
import { ImageGroup } from './image-group'
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Text } from "./ui/text"
import { UserChip } from './user-chip'
import { ScrollView } from "./utils/virtual-lists"
import { getFileSize } from "app/lib/file-upload"
import { filesize } from "filesize"
import { uniqBy } from "lodash"

export type withId = { id: string }
export type withUri = { uri: string }
export type Asset<T extends withId | withUri> = T & { mimeType: string, name: string }

export type ChatMessage<T extends withId | withUri> = (Omit<Message, "user_created" | "assets"> & { user_created: Pick<User, "first_name" | "id" | "last_name" | "avatar" | "plan"> } & { sent: boolean, assets?: Asset<T>[] })

export type CurrentMessage = {
    text: string,
    assets?: Asset<withUri>[]
}

type ChatUiProps = {
    messages: ChatMessage<withId | withUri>[],
    goToId?: string,
    currentUserId: string,
    currentMessage: CurrentMessage,
    currentMessageDispatcher: Dispatch<SetStateAction<CurrentMessage>>,
    onSend: () => void,
    isGroup?: boolean,
    listProps?: Omit<SectionListProps<ChatMessage<withId | withUri>>, "sections" | "renderItem">
}

export const ChatBubble = (props: ChatMessage<withId | withUri> & { currentUserId: string } & { goToId?: string, isFirst: boolean, isLast: boolean, isGroup?: boolean }) => {
    const { user } = userStore()
    const { colors } = useColorScheme()

    const renderRight = props.user_created.id === props.currentUserId
    const hasAsset = props.assets && props.assets.length > 0

    const isTextBig = props.content.length > 40
    const additionalSpacing = renderRight ? isTextBig ? "mr-0 mb-1" : "mr-2" : isTextBig ? "ml-0 mb-1" : "ml-2"
    const toHighlight = props.goToId === props.id
    const flexDirection = hasAsset ? "flex-col" : isTextBig ? "flex-col" : renderRight ? "flex-row" : "flex-row-reverse"
    const marginDirection = renderRight ? "ml-auto mr-0" : "mr-auto ml-0"
    const containerStyle = renderRight ? "bg-primary flex-start" : "bg-secondary flex-end"
    const roundedStyle = renderRight ?
        cn("rounded-tl-2xl rounded-bl-2xl", props.isFirst ? "rounded-br-2xl" : "", props.isLast ? "rounded-tr-2xl" : "")
        : cn("rounded-tr-2xl rounded-br-2xl", props.isLast ? "rounded-tl-2xl" : "", props.isFirst ? "rounded-bl-2xl" : "")
    const infoPositioning = renderRight ? "ml-auto mr-0" : "mr-auto ml-0"
    const textColor = renderRight ? "!text-primary-foreground" : "text-background"

    return <View className={cn("px-4 native:px-0", toHighlight && "bg-accent", "mt-[1px]", props.isGroup && "flex-col gap-1", props.isFirst && "mb-2", props.isLast && "mt-2")}>
        {(props.isGroup && props.isLast && props.user_created.id !== user.id) ?
            <View className='items-start'>
                <UserChip user={props.user_created} />
            </View> : <></>}
        <View className={cn("py-2 px-4 items-center max-w-[90%] md:max-w-[50%]", containerStyle, roundedStyle, flexDirection, marginDirection
        )}>
            <View className='flex-col'>
                {props.assets && props.assets.length ? <ImageGroup assets={props.assets} /> : <></>}
                {props.content ? <Text className={cn(additionalSpacing, textColor)}>
                    <Autolink linkProps={{
                        style: {
                            color: colors.info,
                        }
                    }} text={props.content} email url phone="sms" />
                </Text> : <></>}
            </View>
            <View className={cn("flex-row gap-1 items-center", infoPositioning)}>
                <Text className={cn("text-xs font-light", textColor)}>{shortTime(props.date_created)}</Text>
                {renderRight ? props.sent ? <Check size={12} className={textColor} /> : <Clock size={12} className={textColor} /> : <></>}
            </View>
        </View>
    </View>
}

const FooterDropDownMenu = (props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, currentMessageDispatcher: Dispatch<SetStateAction<CurrentMessage>> }) => {

    const handleAssetUpload = async (type: "document" | "image") => {
        const result = type === "document" ? await DocumentPicker.getDocumentAsync() : await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true })

        if (!result.canceled) {
            const _assets = result.assets.map(asset => {
                return {
                    uri: asset.uri,
                    mimeType: asset.mimeType ?? "application/octet-stream", type,
                    name: type === "document" ? (asset as DocumentPicker.DocumentPickerAsset).name : (asset as ImagePicker.ImagePickerAsset).fileName ?? "pancakes"
                }
            }).filter(async asset => {
                const fileSize = await getFileSize(asset)
                if (fileSize > 1 * 1024 * 1024) {
                    alert(`File size exceeds 1MB limit for ${asset.name} (${filesize(fileSize)})`)
                    return false
                }
                return true
            })
            props.currentMessageDispatcher(p => ({ ...p, assets: _assets }))
        }
    }

    return <DropdownMenu onOpenChange={props.setOpen}>
        <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} onPress={() => props.setOpen(p => !p)}>
                <Paperclip size={18} className="!text-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">
            <DropdownMenuItem onPress={() => handleAssetUpload("image")}>
                <View className="flex-row gap-2 items-center">
                    <ImageIcon size={16} className="!text-primary" />
                    <Text className="!text-sm">Upload Image</Text>
                </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => handleAssetUpload("document")}>
                <View className="flex-row gap-2 items-center">
                    <FileIcon size={16} className="!text-primary" />
                    <Text className="!text-sm">Upload Document</Text>
                </View>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu >
}
const Footer = (props: Pick<ChatUiProps, "currentMessage" | "currentMessageDispatcher" | "onSend" |
    "isGroup">) => {
    const { colors } = useColorScheme()
    const [open, setOpen] = useState(false)
    const [openBottomSheet, setOpenBottomSheet] = useState(false)
    const { rest } = directusStore()

    const { currentMessage, currentMessageDispatcher, onSend } = props
    const disabled = !(Boolean(currentMessage.text) || Boolean(currentMessage.assets))

    const handleFormGeneration = async (values: A2AFormType) => {
        const res = await rest.request(createItem("forms", {
            name: values.name,
            listing: values.listing!.id,
            commission_seller: values.commissionSeller,
            commission_buyer: values.commissionBuyer,
            client_name: values.clientName,
            receiver: values.listing!.user_created.id
        }))
        await Linking.openURL(`${portfolioUrl}/api/generate-a2aform/${res.id}`)
    }

    type A2AFormType = {
        name: string,
        listing: RenderListingTileProps | null,
        commissionSeller: number | null,
        commissionBuyer: number | null,
        clientName: string
    }
    const formSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        listing: Yup.object().shape({
            id: Yup.string().required("Listing is required"),
        }).nonNullable().required("Listing is required"),
        commissionSeller: Yup.number()
            .required("Seller Commission is required")
            .typeError("Seller Commission must be a number"),
        commissionBuyer: Yup.number()
            .required("Buyer Commission is required")
            .typeError("Buyer Commission must be a number"),
        clientName: Yup.string().required("Client Name is required")
    })


    const Form = (props: FormikProps<A2AFormType>) => {
        return <View className="flex-1">
            <ScrollView contentContainerClassName="flex-grow flex-col gap-4">
                <View className="flex-col gap-4">
                    <FormInput
                        value={props.values.name}
                        onChangeText={props.handleChange("name")}
                        label='Title of the listing'
                        error={props.touched.name ? props.errors.name : ""}
                        onBlur={props.handleBlur("name")}
                    />
                    <FormAutoSelect
                        currentItem={props.values.listing}
                        setCurrentItem={item => props.setFieldValue("listing", item)}
                        label="Listing"
                        error={props.touched.listing ? props.errors.listing : ""}
                        item="listings"
                        filter={{}}
                        onBlur={props.handleBlur("listing")}
                    />
                    <FormInput
                        value={props.values.commissionSeller?.toString()}
                        onChangeText={props.handleChange("commissionSeller")}
                        label='Seller Commission %'
                        error={props.touched.commissionSeller ? props.errors.commissionSeller : ""}
                        keyboardType='numeric'
                        onBlur={props.handleBlur("commissionSeller")}
                    />
                    <FormInput
                        value={props.values.commissionBuyer?.toString()}
                        onChangeText={props.handleChange("commissionBuyer")}
                        label='Buyer Commission %'
                        error={props.touched.commissionBuyer ? props.errors.commissionBuyer : ""}
                        keyboardType='numeric'
                        onBlur={props.handleBlur("commissionBuyer")}
                    />
                    <FormInput
                        value={props.values.clientName}
                        onChangeText={props.handleChange("clientName")}
                        label='Client Name'
                        error={props.touched.clientName ? props.errors.clientName : ""}
                        onBlur={props.handleBlur("clientName")}
                    />
                    <Separator />
                </View>
                <Button onPress={props.submitForm} className="mt-auto mb-0">
                    {props.isValid ? <Text>Generate</Text> : <Text></Text>}
                </Button>
            </ScrollView>
        </View>
    }

    return <View className='flex-col'>
        <Separator />
        {currentMessage.assets && currentMessage.assets.length ? <View className='border-solid border-0 border-l-4 border-primary bg-accent p-2 flex-row justify-between items-center'>
            <Text>Selected {currentMessage.assets.length} {currentMessage.assets.length === 1 ? "asset" : "assets"}</Text>
            <Button onPress={() => currentMessageDispatcher(p => ({ text: p.text }))} size={"icon"} className='w-5 h-5 bg-destructive'>
                <X size={12} className='text-destructive-foreground' />
            </Button>
        </View> : <></>}
        <View className="flex-row gap-4 native:h-16 h-14 w-full py-2 px-4 items-center bg-card">
            {disabled && <>
                <FooterDropDownMenu open={open} setOpen={setOpen} currentMessageDispatcher={currentMessageDispatcher} />
                {!props.isGroup ? <Button onPress={() => setOpenBottomSheet(true)} variant={"ghost"} size={"icon"}>
                    <FileLock2 className='text-foreground' size={18} />
                </Button> : <></>}
            </>}
            <Input
                placeholder="Type ..."
                placeholderTextColor={colors.subtext}
                value={currentMessage.text}
                onChangeText={(newVal) => currentMessageDispatcher(p => ({ ...p, text: newVal }))}
                selectionColor={colors.foreground}
                className="flex-1 rounded-full !text-foreground" />
            {disabled ? <></> : <Button variant={"outline"} size={"icon"} className="rounded-full justify-center items-center border-primary" onPress={onSend}>
                <Send size={16} className="!text-foreground" />
            </Button>
            }
        </View>
        <BottomSheet open={openBottomSheet} onBackdropPress={() => setOpenBottomSheet(false)} setOpen={setOpenBottomSheet}>
            <View className='p-4 bg-card flex-col gap-8'>
                <View className='flex-row justify-between'>
                    <Text>Generate <Text className='text-primary'>Agent to Agent</Text> agreement form</Text>
                    <Button onPress={() => setOpenBottomSheet(false)} variant={"destructive"} size={"smallIcon"}>
                        <X size={16} className='text-destructive-foreground' />
                    </Button>
                </View>
                <Formik
                    initialValues={{
                        name: "",
                        listing: null,
                        commissionSeller: null,
                        commissionBuyer: null,
                        clientName: ""
                    } as A2AFormType}
                    validationSchema={formSchema}
                    onSubmit={handleFormGeneration}
                    validateOnMount
                    validateOnBlur
                    validateOnChange
                    enableReinitialize
                >
                    {props => <Form {...props} />}
                </Formik>
            </View>
        </BottomSheet>
    </View>
}

function formatDate(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight

    const diffInDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays === -1) { // -1 means yesterday
        return 'Yesterday';
    } else if (diffInDays >= -6 && diffInDays < 0) { // -6 to 0 means within the last 6 days
        return dayOfWeekNames[date.getDay()];
    } else {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
}

const generateSections = (messages: ChatMessage<withId | withUri>[]) => {
    const sectionMap = messages.reduce<{ [key: string]: { timeStamp: string, messages: ChatMessage<withId | withUri>[] } }>((acc, message) => {
        const timeStamp = new Date(message.date_created)
        const date = `${timeStamp.getFullYear()}-${timeStamp.getMonth()}-${timeStamp.getDate()}`
        if (!acc[date]) {
            acc[date] = {
                timeStamp: message.date_created,
                messages: []
            }
        }
        acc[date]!.messages.push(message)
        return acc
    }, {})
    return Object.keys(sectionMap).map(date => ({ title: formatDate(new Date(sectionMap[date]!.timeStamp)), data: sectionMap[date]!.messages }))
}


export const ChatUi = (props: ChatUiProps) => {
    const listRef = useRef<SectionList>(null)
    const sections = useMemo(() => generateSections(uniqBy(props.messages, "id")), [props.messages])

    useEffect(() => {
        if (props.goToId) {
            const { foundItemIndex, foundSectionIndex } = sections.reduce((acc, section, sectionIndex) => {
                const foundItemIndex = section.data.findIndex(item => item.id === props.goToId)
                if (foundItemIndex !== -1) {
                    acc.foundItemIndex = foundItemIndex
                    acc.foundSectionIndex = sectionIndex
                }
                return acc
            }, {
                foundItemIndex: -1,
                foundSectionIndex: -1
            })
            if (foundItemIndex === -1 || foundSectionIndex === -1) return
            listRef.current?.scrollToLocation({ itemIndex: foundItemIndex, sectionIndex: foundSectionIndex, animated: true, viewPosition: 0.5 })
        }

    }, [props.goToId, props.messages, sections])

    return <View className="flex-1">
        <View className="flex-1 grow-1">
            <SectionList
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 1 }}
                inverted={true}
                ref={listRef}
                sections={sections}
                renderItem={({ item, index, section }) => <ChatBubble
                    {...item}
                    currentUserId={props.currentUserId}
                    goToId={props.goToId}
                    isFirst={(index === 0 || section.data[index - 1]?.user_created.id !== item.user_created.id)}
                    isLast={(index === section.data.length - 1 || section.data[index + 1]?.user_created.id !== item.user_created.id)}
                    isGroup={props.isGroup}
                />}
                renderSectionFooter={({ section }) => <Text className='text-sm text-center text-subtext py-4'>{section.title}</Text>}
                keyExtractor={(_, index) => index.toString() as string}
                {...props.listProps}
                bounces={false}
                overScrollMode='never'
            />
        </View>
        <Footer currentMessage={props.currentMessage} currentMessageDispatcher={props.currentMessageDispatcher} onSend={props.onSend} isGroup={props.isGroup} />
    </View>
}