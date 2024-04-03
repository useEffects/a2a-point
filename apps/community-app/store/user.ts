import { create } from "zustand";
import { User } from "~/types";

type userStore = {
    user: User,
    setUser: (user: User) => void
}

const userStore = create<userStore>((set, get) => ({
    user: {} as User,
    setUser: (user: User) => set(state => ({
        user
    }))
}))

export default userStore