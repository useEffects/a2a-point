import { create } from "zustand";
import { User } from "app/lib/types";

type UserStore = {
    user: User,
    setUser: (user: User) => void
}

const userStore = create<UserStore>((set, get) => ({
    user: {} as User,
    setUser: (user: User) => set({ user })
}));

export default userStore