import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { AuthController } from "../controllers/auth.controller";
import { CreateUserDto, LoginUserDto } from "../dtos/users.dto";
import { ValidationMiddleware } from "../middlewares/validation.middleware";

export class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(CreateUserDto),
      this.auth.signUp,
    );
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(LoginUserDto),
      this.auth.logIn,
    );
  }
}