import { NextFunction, Request, Response } from "express";
import { HttpException } from "@exceptions/HttpException";
import { clearAuthCookies, REFRESH_PATH } from "@utils/cookies";

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.path === REFRESH_PATH) {
      clearAuthCookies(res);
    }

    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
