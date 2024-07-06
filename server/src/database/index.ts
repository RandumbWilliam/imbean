import { connect } from "mongoose";
import { DB_URI } from "../config";

export const dbConnection = async () => {
  const dbConfig = {
    url: DB_URI as string,
  };

  await connect(dbConfig.url);
};
