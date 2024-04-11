import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from "expo-image-picker"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import Autolink from 'react-native-autolink'
import { Swipeable } from "react-native-gesture-handler"
import { useColorScheme } from "~/lib/useColorScheme"
import { cn } from "~/lib/utils"
import { Message, User } from "~/types"
import { ImageGroup } from './image-group'
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Text } from "./ui/text"

export type withId = { id: string }
export type withUri = { uri: string }
export type Asset<T extends withId | withUri> = T & { mimeType: string, name: string }

export type ChatMessage<T extends withId | withUri> = (Omit<Message, "user_created" | "assets"> & { user_created: Pick<User, "first_name" | "id" | "avatar"> } & { sent: boolean, assets?: Asset<T>[] })

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
}

export const ChatBubble = (props: ChatMessage<withId | withUri> & { currentUserId: string } & { goToId?: string, isFirst: boolean, isLast: boolean }) => {
    const { colors } = useColorScheme()
    const renderRight = props.user_created.id === props.currentUserId
    const hasAsset = props.assets && props.assets.length > 0

    const isTextBig = props.content.length > 40
    const additionalSpacing = renderRight ? isTextBig ? "mr-0" : "mr-2" : isTextBig ? "ml-0" : "ml-2"
    const textAlign = renderRight ? "text-left" : "text-right"
    const toHighlight = props.goToId === props.id
    const flexDirection = hasAsset ? "flex-col" : isTextBig ? "flex-col" : "flex-row"
    const containerStyle = renderRight ? "bg-primary text-primary-foreground flex-start" : "bg-secondary bg-secondary-foreground flex-end"
    const roundedStyle = renderRight ? cn("rounded-tl-2xl rounded-bl-2xl", props.isFirst ? "rounded-br-2xl" : "", props.isLast ? "rounded-tr-2xl" : "") : cn("rounded-tr-full rounded-br-full", props.isLast ? "rounded-tl-full" : "")
    const infoPositioning = renderRight ? "ml-auto mr-0" : "mr-auto ml-0"

    return <Swipeable containerStyle={{ marginVertical: 1, alignItems: renderRight ? "flex-end" : "flex-start", backgroundColor: toHighlight ? colors.accent : undefined }}>
        <View className={cn("p-1 px-2 items-center max-w-[80%]", containerStyle, roundedStyle, flexDirection)}>
            <View className='flex-col'>
                {props.assets && props.assets.length ? <ImageGroup assets={props.assets} /> : <></>}
                <Text className={cn(additionalSpacing, textAlign, "text-inherit")}>
                    <Autolink text={props.content} email url phone="sms" />
                </Text>
            </View>
            <View className={cn("flex-row gap-1 items-center", infoPositioning)}>
                <Text className={cn("text-xs font-light text-inherit")}>{(new Date(props.date_created)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                <Feather name={props.sent ? "check" : "clock"} className={"text-inherit"} />
            </View>
        </View>
    </Swipeable>
}

const FooterDropDownMenu = (props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, currentMessageDispatcher: Dispatch<SetStateAction<CurrentMessage>> }) => {

    const handleAssetUpload = async (type: "document" | "image") => {
        const result = type === "document" ? await DocumentPicker.getDocumentAsync({ multiple: true }) : await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true })

        if (!result.canceled) {
            const _assets = result.assets.map(asset => ({ uri: asset.uri, mimeType: asset.mimeType ?? "application/octet-stream", type, name: type === "document" ? (asset as DocumentPicker.DocumentPickerAsset).name : (asset as ImagePicker.ImagePickerAsset).fileName ?? "pancakes" }))
            props.currentMessageDispatcher(p => ({ ...p, assets: _assets }))
        }
    }

    return <DropdownMenu open={props.open} onOpenChange={props.setOpen}>
        <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} onPress={() => props.setOpen(p => !p)}>
                <FontAwesome name="paperclip" size={16} className="!text-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">
            <DropdownMenuItem>
                <View className="flex-row gap-2 items-center">
                    <MaterialIcons name="camera-alt" size={16} className="!text-primary" />
                    <Text className="!text-sm">Open Camera</Text>
                </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => handleAssetUpload("image")}>
                <View className="flex-row gap-2 items-center">
                    <MaterialIcons name="photo" size={16} className="!text-primary" />
                    <Text className="!text-sm">Upload Image</Text>
                </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => handleAssetUpload("document")}>
                <View className="flex-row gap-2 items-center">
                    <MaterialIcons name="file-upload" size={16} className="!text-primary" />
                    <Text className="!text-sm">Upload Document</Text>
                </View>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu >
}

const Footer = (props: Pick<ChatUiProps, "currentMessage" | "currentMessageDispatcher" | "onSend">) => {
    const { colors } = useColorScheme()
    const [open, setOpen] = useState(false)

    const { currentMessage, currentMessageDispatcher, onSend } = props

    return <View className='flex-col mt-1'>
        {currentMessage.assets && currentMessage.assets.length ? <View className='border-solid border-0 border-l-4 border-primary bg-accent p-2 flex-row justify-between items-center'>
            <Text>Selected {currentMessage.assets.length} {currentMessage.assets.length === 1 ? "asset" : "assets"}</Text>
            <Button onPress={() => currentMessageDispatcher(p => ({ text: p.text }))} size={"icon"} className='w-5 h-5 bg-destructive'>
                <Feather name='x' size={12} className='text-destructive-foreground' />
            </Button>
        </View> : <></>}
        <View className="flex-row gap-2 native:h-16 h-14 w-full p-2 items-center bg-card">
            <FooterDropDownMenu open={open} setOpen={setOpen} currentMessageDispatcher={currentMessageDispatcher} />
            <Input multiline={true} placeholder="Type ..." placeholderTextColor={colors.muted} value={currentMessage.text} onChangeText={(newVal) => currentMessageDispatcher(p => ({ ...p, text: newVal }))} selectionColor={colors.foreground} className="grow-1 flex-1 rounded-full" />
            <Button variant={"outline"} disabled={!Boolean(currentMessage.text) && !Boolean(currentMessage.assets)} size={"icon"} className="rounded-full justify-center items-center border-primary" onPress={onSend}>
                <FontAwesome name="send" size={16} className="!text-foreground" />
            </Button>
        </View>
    </View>
}

export const ChatUi = (props: ChatUiProps) => {
    const listRef = useRef<FlatList>(null)

    useEffect(() => {
        if (props.goToId) {
            const foundIndex = props.messages.findIndex(m => m.id === props.goToId)
            if (foundIndex === -1) return
            listRef.current?.scrollToIndex({ index: foundIndex, animated: true, viewPosition: 0.5 })
        }

    }, [props.goToId])

    return <View className="flex-1">
        <View className="flex-1 grow-1">
            <FlatList
                inverted={true}
                ref={listRef}
                data={props.messages}
                renderItem={({ item, index }: { item: ChatMessage<withId | withUri>, index: number }) => <ChatBubble {...({ ...item, currentUserId: props.currentUserId, goToId: props.goToId, isFirst: index === 0, isLast: index === props.messages.length - 1 })} />}
                keyExtractor={(_, index) => index.toString() as string}
            />
        </View>
        <Footer currentMessage={props.currentMessage} currentMessageDispatcher={props.currentMessageDispatcher} onSend={props.onSend} />
    </View>
}