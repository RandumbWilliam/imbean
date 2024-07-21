import { cleanEnv, port, str } from "envalid";

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    APP_ORIGIN: str(),
    DB_URI: str(),
    JWT_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    RESEND_API_KEY: str(),
    EMAIL_SENDER: str(),
  });
};
