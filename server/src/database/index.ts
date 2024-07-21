import { connect } from "mongoose";
import { DB_URI } from "@config";

export const dbConnection = async () => {
  try {
    await connect(DB_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("Could not connect to database", error);
    process.exit(1);
  }
};
