import { Company, User, Document } from 'app/lib/types';
import { create } from 'zustand';

type UserStore = {
  user: User;
  company: Company;
  document: Document;
};

export const userStore = create<UserStore>((set, get) => ({
  user: {} as User,
  company: {} as Company,
  document: {} as Document,
}));
