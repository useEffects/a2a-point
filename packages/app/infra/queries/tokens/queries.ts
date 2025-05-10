import { UseQueryOptions } from '@tanstack/react-query';
import _ from 'lodash';
import {
  directusAccessTokenKey,
  directusRefreshTokenKey,
  kcAccessTokenKey,
  kcRefreshTokenKey,
} from './utils';
import { AuthTokenSet } from './types';
import { storage } from 'app/infra/storage';

export const createTokensQOpts = (
  queryOptions: Partial<UseQueryOptions<AuthTokenSet>> = {},
) => {
  return _.merge(
    {
      queryKey: ['TOKENS FROM (SECURE) STORAGE'],
      queryFn: async () => {
        const kcAccessToken = await storage.getItem(kcAccessTokenKey);
        const kcRefreshToken = await storage.getItem(kcRefreshTokenKey);
        const directusAccessToken = await storage.getItem(
          directusAccessTokenKey,
        );
        const directusRefreshToken = await storage.getItem(
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
