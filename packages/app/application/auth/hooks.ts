import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import _ from 'lodash';
import { createTokensQOpts } from '../../infra/queries/tokens/queries';
import { queryClient } from 'app/store/query';
import { tryCatch } from 'app/shared/utils/tryCatch';
import {
  directusTokenFlow,
  exchangeKcTokenWithDirectus,
  runAuthEffects,
} from './utils';

export const useAuthFlow = () =>
  useQuery({
    queryKey: ['AUTHFLOW QUERY CONTEXT'],
    queryFn: async () => {
      const isAuthenticated = await runAuthFlow();
      return { isAuthenticated };
    },
  });

const runAuthFlow = async (): Promise<boolean> => {
  const tokens = await queryClient.fetchQuery(createTokensQOpts());

  const [directusOK] = await tryCatch(
    directusTokenFlow({
      accessToken: tokens.directusAccessToken,
      refreshToken: tokens.directusRefreshToken,
    }),
  );

  if (directusOK) return runAuthEffects(tokens);

  if (!tokens.kcAccessToken || !tokens.kcRefreshToken) return false;

  const [newTokens] = await tryCatch(
    exchangeKcTokenWithDirectus({
      accessToken: tokens.kcAccessToken,
      refreshToken: tokens.kcRefreshToken,
    }),
  );

  if (!newTokens) return false;

  const [_, err] = await tryCatch(
    directusTokenFlow({
      accessToken: newTokens.directusAccessToken,
      refreshToken: newTokens.directusRefreshToken,
    }),
  );

  if (err) {
    console.warn('Directus token validation after KC exchange failed', err);
    return false;
  }

  return runAuthEffects(newTokens);
};
