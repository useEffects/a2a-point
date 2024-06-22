import { create } from "zustand";
import { Company, User, Document } from "app/lib/types";

type UserStore = {
    user: User,
    company: Company,
    document: Document
}

const userStore = create<UserStore>((set, get) => ({
    user: {} as User,
    company: {} as Company,
    document: {} as Document
}));

export default userStore