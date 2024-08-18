import { env } from '@config';
import { connect, set } from 'mongoose';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`,
    options: {},
  };

  if (env.isDev) {
    set('debug', true);
  }

  await connect(dbConfig.url, dbConfig.options);
};
