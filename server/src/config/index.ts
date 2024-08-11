import { config } from 'dotenv';
config({ path: `.env` });

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing env variable ${key}`);
  }

  return value;
};

export const PORT = getEnv('PORT', '4000');
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const APP_ORIGIN = getEnv('APP_ORIGIN');
export const DB_URI = getEnv('DB_URI');
export const JWT_SECRET = getEnv('JWT_SECRET');
export const JWT_REFRESH_SECRET = getEnv('JWT_REFRESH_SECRET');
export const RESEND_API_KEY = getEnv('RESEND_API_KEY');
export const EMAIL_SENDER = getEnv('EMAIL_SENDER');
export const LOG_FORMAT = getEnv('LOG_FORMAT');
export const LOG_DIR = getEnv('LOG_DIR');
