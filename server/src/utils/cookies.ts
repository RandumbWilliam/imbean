import { env } from '@config';
import { ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_EXPIRY } from '@constants';
import { CookieOptions, Response } from 'express';

const defaults: CookieOptions = {
  sameSite: 'strict',
  httpOnly: true,
  secure: env.isProduction,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  path: '/auth/refresh',
});

export const setAuthCookies = ({ res, accessToken, refreshToken }: { res: Response; accessToken: string; refreshToken: string }) =>
  res
    .cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, getAccessTokenCookieOptions())
    .cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) => {
  return res.clearCookie(ACCESS_TOKEN_COOKIE_NAME).clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/auth/refresh' });
};
