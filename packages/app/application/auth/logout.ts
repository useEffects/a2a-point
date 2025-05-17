import {
  kcAccessTokenKey,
  directusAccessTokenKey,
  directusRefreshTokenKey,
  kcRefreshTokenKey,
} from 'app/infra/queries/tokens/utils';
import { secureStorage } from 'app/infra/storage';
import { KC_URL, KC_REALM, KC_CLIENT_ID } from 'app/lib/constants';
import { directusStore } from 'app/store/directus';
import RNRestart from 'react-native-restart';
import { setStoresInitial } from './utils';
import { queryClient } from 'app/store/query';
import { createTokensQOpts } from 'app/infra/queries/tokens/queries';

export const logout = async () => {
  try {
    const tokens = await queryClient.fetchQuery(createTokensQOpts());
    await fetch(`${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: KC_CLIENT_ID!,
        refresh_token: tokens.kcRefreshToken,
      }).toString(),
    });
    await directusStore.getState().rest.logout();
    await secureStorage.removeItem(kcAccessTokenKey);
    await secureStorage.removeItem(kcRefreshTokenKey);
    await secureStorage.removeItem(directusAccessTokenKey);
    await secureStorage.removeItem(directusRefreshTokenKey);

    setStoresInitial();
    queryClient.clear();

    RNRestart.restart();
  } catch (error) {
    console.error('I/O operations in Logout failed', error);
  }
};
