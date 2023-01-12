import { CookieOptions } from 'express';

// TODO: implement httponly cookies
export const cookieOptions: CookieOptions = {
  httpOnly: false,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: process.env.NODE_ENV === 'production' ? 'sb-gateway.onrender.com' : 'http://localhost',
};

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

export const accessTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + 600 * 60 * 1000),
  maxAge: 600 * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + 500 * 60 * 1000),
  maxAge: 500 * 60 * 1000,
};
