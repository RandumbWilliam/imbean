import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { MessageController } from "controllers/message.controller";
import { AuthMiddleware } from "middlewares/auth.middleware";

export class MessageRoute implements Routes {
  public path = "/messages";
  public router = Router();
  public message = new MessageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/send/:receiverId`,
      AuthMiddleware,
      this.message.sendMessage,
    );
  }
}
