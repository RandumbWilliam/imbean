import { config } from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const env = cleanEnv(process.env, {
  PORT: num({ default: 4000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  APP_ORIGIN: str(),
  DB_HOST: str(),
  DB_PORT: num(),
  DB_DATABASE: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  RESEND_API_KEY: str(),
  EMAIL_SENDER: str(),
  LOG_FORMAT: str(),
  LOG_DIR: str(),
});
