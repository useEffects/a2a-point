import { ChatsContext } from "app/context/chats"
import { useContext } from "react"

export const useChats = () => {
    return useContext(ChatsContext)
}