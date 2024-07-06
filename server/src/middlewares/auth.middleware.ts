import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import { HttpException } from "../exceptions/HttpException";
import { DataStoredInToken } from "../interfaces/auth.interface";
import { UserModel } from "../models/users.model";

const getAuthorization = (req: Request) => {
  const cookie = req.cookies["Authorization"];
  if (cookie) return cookie;

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id } = (await verify(
        Authorization,
        "keyboardcat",
      )) as DataStoredInToken;
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong auth token."));
      }
    } else {
      next(new HttpException(404, "Missing auth token"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong auth token"));
  }
};
