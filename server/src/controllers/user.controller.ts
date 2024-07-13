import { Container } from "typedi";
import { Response, Request, NextFunction } from "express";
import { User } from "interfaces/users.interface";
import { UserService } from "services/user.service";

export class UserController {
  public user = Container.get(UserService);

  public getUsersForSidebar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.authUser || !req.authUser._id) {
        return res.status(401);
      }

      const loggedInUserId = req.authUser._id;

      const filteredUsers = await this.user.getUsers(loggedInUserId);

      return res.status(201).json(filteredUsers);
    } catch (error) {
      next(error);
    }
  };
}
