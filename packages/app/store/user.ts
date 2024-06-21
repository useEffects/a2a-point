import { create } from "zustand";
import { Company, User } from "app/lib/types";

type UserStore = {
    user: User,
    company: Company,
}

const userStore = create<UserStore>((set, get) => ({
    user: {} as User,
    company: {} as Company,
}));

export default userStore