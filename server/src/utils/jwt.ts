import { env } from '@config';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@constants';
import { SessionDocument } from '@models/sessions.model';
import { UserDocument } from '@models/users.model';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

export type RefreshTokenPayload = {
  sessionId: SessionDocument['_id'];
};

export type AccessTokenPayload = {
  userId: UserDocument['_id'];
  sessionId: SessionDocument['_id'];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ['user'],
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '15m',
  secret: env.JWT_ACCESS_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '30d',
  secret: env.JWT_REFRESH_SECRET,
};

export const signToken = (payload: AccessTokenPayload | RefreshTokenPayload, options?: SignOptionsAndSecret) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;

  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(token: string, options?: VerifyOptions & { secret: string }) => {
  const { secret = env.JWT_ACCESS_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;

    return { payload };
  } catch (error: any) {
    return { error: error.mesage };
  }
};

export const createRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const createAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const verifyRefreshToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};
