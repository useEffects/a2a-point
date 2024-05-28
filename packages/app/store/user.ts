import { create } from "zustand";
import { Company, User } from "app/lib/types";

type FullUser = User & { company: Company }

type UserStore = {
    user: FullUser,
    setUser: (user: FullUser) => void
}

const userStore = create<UserStore>((set, get) => ({
    user: {} as FullUser,
    setUser: (user: FullUser) => set({ user })
}));

export default userStore