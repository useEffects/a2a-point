import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { SectionList, SectionListProps, View } from "react-native"
import Autolink from 'react-native-autolink'
import { shortTime } from 'app/lib/helpers'
import { useColorScheme } from "app/hooks/color-scheme"
import { cn } from "app/lib/utils"
import userStore from 'app/store/user'
import { Message, User } from "app/lib/types"
import { ImageGroup } from './image-group'
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Text } from "./ui/text"
import { UserChip } from './user-chip'
import { WandSparkles, Paperclip, Camera, Image as ImageIcon, File as FileIcon, X, Send, Check, Clock } from 'app/components/icons'
import BottomSheet from './bottomsheet'
import { CloseButton } from './utils'
import { FormAutoSelect, FormInput, RenderListingTileProps } from './formComponents'
import directusStore from 'app/store/directus'
import { createItem } from "@directus/sdk"
import * as Linking from "expo-linking"
import { portfolioUrl } from 'app/lib/constants'

export type withId = { id: string }
export type withUri = { uri: string }
export type Asset<T extends withId | withUri> = T & { mimeType: string, name: string }

export type ChatMessage<T extends withId | withUri> = (Omit<Message, "user_created" | "assets"> & { user_created: Pick<User, "first_name" | "id" | "last_name" | "avatar"> } & { sent: boolean, assets?: Asset<T>[] })

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

    const renderRight = props.user_created.id === props.currentUserId
    const hasAsset = props.assets && props.assets.length > 0

    const isTextBig = props.content.length > 40
    const additionalSpacing = renderRight ? isTextBig ? "mr-0" : "mr-2" : isTextBig ? "ml-0" : "ml-2"
    const toHighlight = props.goToId === props.id
    const flexDirection = hasAsset ? "flex-col" : isTextBig ? "flex-col" : renderRight ? "flex-row" : "flex-row-reverse"
    const marginDirection = renderRight ? "ml-auto mr-0" : "mr-auto ml-0"
    const containerStyle = renderRight ? "bg-primary flex-start" : "bg-secondary flex-end"
    const roundedStyle = renderRight ?
        cn("rounded-tl-2xl rounded-bl-2xl", props.isFirst ? "rounded-br-2xl" : "", props.isLast ? "rounded-tr-2xl" : "")
        : cn("rounded-tr-2xl rounded-br-2xl", props.isLast ? "rounded-tl-2xl" : "", props.isFirst ? "rounded-bl-2xl" : "")
    const infoPositioning = renderRight ? "ml-auto mr-0" : "mr-auto ml-0"
    const textColor = renderRight ? "!text-primary-foreground" : "text-background"

    return <View className={cn(toHighlight && "bg-accent", "mt-[1px]", props.isGroup && "flex-col gap-1")}>
        {(props.isGroup && props.isLast && props.user_created.id !== user.id) ?
            <View className='items-start'>
                <UserChip user={props.user_created} />
            </View> : <></>}
        <View className={cn("p-1 px-2 items-center max-w-[90%]", containerStyle, roundedStyle, flexDirection, marginDirection
        )}>
            <View className='flex-col'>
                {props.assets && props.assets.length ? <ImageGroup assets={props.assets} /> : <></>}
                <Text className={cn(additionalSpacing, textColor)}>
                    <Autolink text={props.content} email url phone="sms" />
                </Text>
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
                const fileInfo = await FileSystem.getInfoAsync(asset.uri, { size: true }) as FileSystem.FileInfo & { size: number }
                if (fileInfo.size > 1 * 1024 * 1024) {
                    alert(`File size exceeds 1MB limit for ${asset.name} (${fileInfo.size / 1000 / 1000}MB)`)
                    return false
                }
                return true
            })
            props.currentMessageDispatcher(p => ({ ...p, assets: _assets }))
        }
    }

    return <DropdownMenu open={props.open} onOpenChange={props.setOpen}>
        <DropdownMenuTrigger asChild>
            <Button size={"none"} variant={"base"} onPress={() => props.setOpen(p => !p)}>
                <Paperclip size={18} className="!text-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">
            <DropdownMenuItem>
                <View className="flex-row gap-2 items-center">
                    <Camera size={16} className="!text-primary" />
                    <Text className="!text-sm">Open Camera</Text>
                </View>
            </DropdownMenuItem>
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
const Footer = (props: Pick<ChatUiProps, "currentMessage" | "currentMessageDispatcher" | "onSend">) => {
    const { colors } = useColorScheme()
    const [open, setOpen] = useState(false)
    const [openBottomSheet, setOpenBottomSheet] = useState(false)
    const [currentListing, setCurrentListing] = useState<RenderListingTileProps | null>(null)
    const [name, setName] = useState("")
    const { rest } = directusStore()

    const { currentMessage, currentMessageDispatcher, onSend } = props
    const disabled = !(Boolean(currentMessage.text) || Boolean(currentMessage.assets))

    const handleFormGeneration = async () => {
        const res = await rest.request(createItem("forms", {
            name,
            listing: currentListing?.id,
            receiver: currentListing?.user_created.id
        }))
        await Linking.openURL(`${portfolioUrl}/api/generate-a2aform/${res.id}`)
    }

    return <View className='flex-col mt-1'>
        {currentMessage.assets && currentMessage.assets.length ? <View className='border-solid border-0 border-l-4 border-primary bg-accent p-2 flex-row justify-between items-center'>
            <Text>Selected {currentMessage.assets.length} {currentMessage.assets.length === 1 ? "asset" : "assets"}</Text>
            <Button onPress={() => currentMessageDispatcher(p => ({ text: p.text }))} size={"icon"} className='w-5 h-5 bg-destructive'>
                <X size={12} className='text-destructive-foreground' />
            </Button>
        </View> : <></>}
        <View className="flex-row gap-4 native:h-16 h-14 w-full py-2 px-4 items-center bg-card">
            <FooterDropDownMenu open={open} setOpen={setOpen} currentMessageDispatcher={currentMessageDispatcher} />
            <Button onPress={() => setOpenBottomSheet(true)} variant={"base"} size={"none"}>
                <WandSparkles className='text-foreground' size={18} />
            </Button>
            <Input
                multiline={true}
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
            <View className='p-4 bg-card flex-col gap-4'>
                <View className='flex-row flex-1 justify-between'>
                    <Text>Generate <Text className='text-primary'>Agent to Agent</Text> agreement form</Text>
                    <CloseButton onPress={() => setOpenBottomSheet(false)} />
                </View>
                <FormInput
                    value={name}
                    onChangeText={setName}
                    label='Name of the form'
                />
                <FormAutoSelect
                    currentItem={currentListing}
                    setCurrentItem={item => setCurrentListing(item as RenderListingTileProps)}
                    label="Location"
                    error={""}
                    item="listings"
                    filter={{}}

                />
                <Button disabled={!Boolean(currentListing) || !Boolean(name)} onPress={handleFormGeneration}>
                    <Text>Generate</Text>
                </Button>
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
    const sections = useMemo(() => generateSections(props.messages), [props.messages])

    useEffect(() => {
        if (props.goToId) {
            const foundItemIndex = props.messages.findIndex(m => m.id === props.goToId)
            const foundSectionIndex = sections.findIndex(section => section.data.findIndex(m => m.id === props.goToId) !== -1)
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
                renderSectionFooter={({ section }) => <Text className='text-sm text-center text-subtext py-2'>{section.title}</Text>}
                keyExtractor={(_, index) => index.toString() as string}
                {...props.listProps}
            />
        </View>
        <Footer currentMessage={props.currentMessage} currentMessageDispatcher={props.currentMessageDispatcher} onSend={props.onSend} />
    </View>
}