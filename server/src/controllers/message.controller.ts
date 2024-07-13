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
      if (!req.authUser || !req.authUser._id) {
        return res.status(401);
      }

      const { _id: senderId } = req.authUser;

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

  public getMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id: userToChatId } = req.params;
      if (!req.authUser || !req.authUser._id) {
        return res.status(401);
      }
      const { _id: senderId } = req.authUser;

      const messages = await this.message.getMessage(senderId, userToChatId);

      return res.status(201).json(messages);
    } catch (error) {
      next(error);
    }
  };
}
