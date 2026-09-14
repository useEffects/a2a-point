import { create } from 'zustand';
import { Company, User, Document } from 'app/lib/types';

type UserStore = {
  user: User;
  company: Company;
  document: Document;
  setUserStore: (props: Partial<UserStore>) => void;
};

const userStore = create<UserStore>((set, get) => ({
  user: {} as User,
  company: {} as Company,
  document: {} as Document,
  setUserStore: (props) => set((prev) => ({ ...prev, ...props })),
}));

export default userStore;
