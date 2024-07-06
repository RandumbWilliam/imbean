import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { AuthService } from "../services/auth.service";
import { User } from "../interfaces/users.interface";

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, user } = await this.auth.signup(userData);

      res.setHeader("Set-Cookie", [cookie]);

      return res.status(201).json({ data: user, message: "signup" });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, user } = await this.auth.login(userData);

      res.setHeader("Set-Cookie", [cookie]);

      return res.status(201).json({ data: user, message: "login" });
    } catch (error) {
      next(error);
    }
  };
}
