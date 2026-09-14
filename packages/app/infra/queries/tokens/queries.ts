import { UseQueryOptions } from '@tanstack/react-query';
import _ from 'lodash';
import {
  directusAccessTokenKey,
  directusRefreshTokenKey,
  kcAccessTokenKey,
  kcRefreshTokenKey,
} from './utils';
import { AuthTokenSet } from './types';
import { secureStorage } from 'app/infra/storage';

export const createTokensQOpts = (
  queryOptions: Partial<UseQueryOptions<AuthTokenSet>> = {},
) => {
  return _.merge(
    {
      queryKey: ['TOKENS FROM (SECURE) STORAGE'],
      queryFn: async () => {
        const kcAccessToken = await secureStorage.getItem(kcAccessTokenKey);
        const kcRefreshToken = await secureStorage.getItem(kcRefreshTokenKey);
        const directusAccessToken = await secureStorage.getItem(
          directusAccessTokenKey,
        );
        const directusRefreshToken = await secureStorage.getItem(
          directusRefreshTokenKey,
        );

        return {
          kcAccessToken,
          kcRefreshToken,
          directusAccessToken,
          directusRefreshToken,
        };
      },
    } as UseQueryOptions<AuthTokenSet>,
    queryOptions,
  );
};
