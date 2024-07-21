import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { AuthController } from "../controllers/auth.controller";
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from "@dtos/users.dto";
import { ValidationMiddleware } from "@middlewares/validation.middleware";

export class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/logout`, this.auth.logoutHandler);
    this.router.get(`${this.path}/refresh`, this.auth.refreshHandler);
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware(CreateUserDto),
      this.auth.registerHandler,
    );
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(LoginUserDto),
      this.auth.loginHandler,
    );
    this.router.post(
      `${this.path}/password/forgot`,
      ValidationMiddleware(ForgotPasswordDto),
      this.auth.sendPasswordResetHandler,
    );
    this.router.post(
      `${this.path}/password/reset`,
      ValidationMiddleware(ResetPasswordDto),
      this.auth.resetPasswordHandler,
    );
  }
}
