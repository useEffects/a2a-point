export type AuthTokenSet = {
  kcAccessToken: string;
  kcRefreshToken: string;
  directusAccessToken: string;
  directusRefreshToken: string;
};

export type TokenSet = {
  accessToken: string | null;
  refreshToken: string | null;
};
