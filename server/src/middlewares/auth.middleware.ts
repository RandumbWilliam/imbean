import { RequestHandler } from "express";
import { HttpException } from "@exceptions/HttpException";
import { verifyToken } from "@utils/jwt";

export const AuthMiddlware: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;

  if (!accessToken) throw new HttpException(401, "Not authorized");

  const { error, payload } = verifyToken(accessToken);
  if (!payload)
    throw new HttpException(
      401,
      error === "jwt expired" ? "Token expired" : "Invalid token",
    );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};
