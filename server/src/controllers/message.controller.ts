import { Container } from "typedi";
import { MessageService } from "../services/message.service";
import { Response, Request, NextFunction } from "express";

export class MessageController {
  public message = Container.get(MessageService);

  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { message } = req.body;
      const { receiverId } = req.params;
      const { _id: senderId } = req.user;

      if (!senderId) {
        return res.status(401);
      }

      const newMessageData = await this.message.sendMessage(
        message,
        senderId,
        receiverId,
      );

      return res
        .status(201)
        .json({ data: newMessageData, message: "send message" });
    } catch (error) {
      next(error);
    }
  };
}
