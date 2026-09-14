import { create } from 'zustand';

export const keycloakStore = create<KeycloakStore>((set, get) => ({
  active: false,
  setKeyCloakStore: (props: Partial<KeycloakStore>) =>
    set((p) => ({ ...p, ...props })),
}));

export interface KeycloakStore {
  active: boolean;
  setKeyCloakStore: (props: Partial<KeycloakStore>) => void;
}
