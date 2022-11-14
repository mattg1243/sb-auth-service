import jwt, { SignOptions } from 'jsonwebtoken';

// sign tokens
export const signJwt = (
  payload: Object,
  keyName: 'ACCESS_PRIVATE_KEY' | 'REFRESH_PRIVATE_KEY',
  options: SignOptions
) => {
  // this needs optimization
  let key = keyName === 'ACCESS_PRIVATE_KEY' ? process.env.ACCESS_PRIVATE_KEY : process.env.REFRESH_PRIVATE_KEY;
  if (!key) key = '';

  const privateKey = Buffer.from(key, 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'HS256',
  });
};
// verify tokens
export const verifyJwt = <T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null => {
  // this needs optimization
  let key = keyName === 'accessTokenPublicKey' ? process.env.REFRESH_PUBLIC_KEY : process.env.REFRESH_PUBLIC_KEY;
  if (!key) key = '';
  try {
    const publicKey = Buffer.from(key, 'base64').toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
// creates both an access and refresh token, used on login
// this any here is not ideal
export const signTokens = async (user: any) => {
  const accessToken = signJwt(user, 'ACCESS_PRIVATE_KEY', { expiresIn: '6h' });

  const refreshToken = signJwt(user, 'REFRESH_PRIVATE_KEY', {
    expiresIn: '48h',
  });

  return { accessToken, refreshToken };
};
