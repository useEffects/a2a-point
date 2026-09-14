import {
  DirectusClient,
  RestClient,
  createDirectus,
  rest,
  staticToken,
  AuthenticationClient,
  authentication,
} from '@directus/sdk';
import { DIRECTUS_URL } from 'app/lib/constants';
import { create } from 'zustand';
import * as _ from 'lodash';

const publicToken = 'Mnh7gFAmU4QeNRt_TQhTBrDDBxFdjPNu';
export const initialDirectusStore: Omit<DirectusStore, 'setDirectusStore'> = {
  authenticated: false,
  rest: createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(authentication())
    .with(staticToken(publicToken)),
};

export const directusStore = create<DirectusStore>((set) => ({
  ...initialDirectusStore,
  setDirectusStore: (props) => set((p) => ({ ...p, ...props })),
}));

export interface DirectusClientExtended
  extends DirectusClient<any>,
    RestClient<any>,
    AuthenticationClient<any> {}

export interface DirectusStore {
  authenticated: boolean;
  rest: DirectusClientExtended;
  setDirectusStore: (props: Partial<DirectusStore>) => void;
}
