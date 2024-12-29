import { KC_REFRESH_TOKEN_EXPIRY, NEXT_URL } from 'app/lib/constants';
import { AuthTokens } from '../lib/types';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const keycloakStore = create<KeycloakStore>((set, get) => ({
  accessToken: '',
  refreshToken: '',
  initializeWithRefresh: async (refreshToken: string | null) => {
    if (refreshToken) {
      try {
        const resp = await fetch(`${NEXT_URL}/api/keycloak/refresh`, {
          method: 'POST',
          body: JSON.stringify({
            refreshToken
          })
        });
        if (resp.ok) {
          const json = await (resp.json() as Promise<AuthTokens>);
          if (json.accessToken && json.refreshToken) {
            set((p) => ({ ...p, accessToken: json.accessToken, refreshToken: json.refreshToken }));
            setInterval(() => get().initializeWithRefresh(json.refreshToken), KC_REFRESH_TOKEN_EXPIRY);
            AsyncStorage.setItem('kcRefreshToken', json.refreshToken);
            return true;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return false;
  },
  initialize: async (tokens: AuthTokens) => {
    set((p) => ({ ...p, tokens }));
    AsyncStorage.setItem('kcRefreshToken', tokens.refreshToken);
    setInterval(() => get().initializeWithRefresh(tokens.refreshToken), KC_REFRESH_TOKEN_EXPIRY);
  },
}));

interface KeycloakStore extends AuthTokens {
  initializeWithRefresh: (refreshToken: string | null) => Promise<boolean>;
  initialize: (tokens: AuthTokens) => Promise<void>;
}
