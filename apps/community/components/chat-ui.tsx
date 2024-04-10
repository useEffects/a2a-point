import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { View, FlatList } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import { Message, User } from "~/types"
import { Text } from "./ui/text"
import { cn } from "~/lib/utils"
import { useColorScheme } from "~/lib/useColorScheme"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { FontAwesome, EvilIcons } from '@expo/vector-icons';

export type ChatMessage = (Omit<Message, "user_created"> & { user_created: Pick<User, "first_name" | "id" | "avatar"> } & { sent: boolean })

type ChatUiProps = {
    messages: ChatMessage[],
    goToId?: string,
    currentUserId: string,
    inputText: string,
    inputTextDispatcher: Dispatch<SetStateAction<string>>
    onSend: () => void
}

export const ChatBubble = (props: ChatMessage & { currentUserId: string } & { goToId?: string, isFirst: boolean, isLast: boolean }) => {
    const { colors } = useColorScheme()
    const renderRight = props.user_created.id === props.currentUserId

    const isTextBig = props.content.length > 10
    const additionalSpacing = renderRight ? isTextBig ? "mr-0" : "mr-2" : isTextBig ? "ml-0" : "ml-2"
    const textAlign = renderRight ? "text-left" : "text-right"
    const toHighlight = props.goToId === props.id
    const flexDirection = isTextBig ? "flex-col" : "flex-row"
    const containerStyle = renderRight ? "bg-primary text-primary-foreground flex-start" : "bg-secondary bg-secondary-foreground flex-end"
    const roundedStyle = renderRight ? cn("rounded-tl-[12px] rounded-bl-[12px]", props.isFirst ? "rounded-br-[12px]" : "", props.isLast ? "rounded-tr-[12px]" : "") : cn("rounded-tr-full rounded-br-full", props.isLast ? "rounded-tl-full" : "")
    const infoPositioning = renderRight ? "ml-auto mr-0" : "mr-auto ml-0"

    return <Swipeable containerStyle={{ marginVertical: 1, alignItems: renderRight ? "flex-end" : "flex-start", backgroundColor: toHighlight ? colors.accent : undefined }}>
        <View className={cn("p-1 px-2 items-center max-w-[80%]", containerStyle, roundedStyle, flexDirection)}>
            <Text className={cn(additionalSpacing, textAlign, "text-inherit")}>{props.content}</Text>
            <View className={cn("flex-row gap-1 items-center", infoPositioning)}>
                <Text className={cn("text-xs font-light text-inherit")}>{(new Date(props.date_created)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                <EvilIcons name={props.sent ? "check" : "clock"} className={"text-inherit"} />
            </View>
        </View>
    </Swipeable>
}

const Footer = ({ val, setVal, onSend }: { val: string, setVal: Dispatch<SetStateAction<string>>, onSend: () => void }) => {
    const { colors } = useColorScheme()
    return <View className="flex-row gap-2 native:h-16 h-14 w-full p-2 items-center">
        <Input value={val} onChangeText={setVal} selectionColor={colors.foreground} className="grow-1 flex-1" />
        {val && <Button size={"icon"} className="rounded-full" onPress={onSend}>
            <FontAwesome name="send" size={16} className="!text-primary-foreground" />
        </Button>}
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
                renderItem={({ item, index }: { item: ChatMessage, index: number }) => <ChatBubble {...({ ...item, currentUserId: props.currentUserId, goToId: props.goToId, isFirst: index === 0, isLast: index === props.messages.length - 1 })} />}
                keyExtractor={(_, index) => index.toString() as string}
            />
        </View>
        <Footer val={props.inputText} setVal={props.inputTextDispatcher} onSend={props.onSend} />
    </View>
}