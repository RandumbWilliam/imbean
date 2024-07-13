import { User } from "../interfaces/users.interface";

declare global {
  declare namespace Express {
    interface Request {
      authUser?: User;
    }
  }
}
