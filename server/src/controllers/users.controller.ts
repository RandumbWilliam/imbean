import { Container } from "typedi";
import { UserService } from "services/user.service";
import { catchErrors } from "@/utils/catchErrors";
import { UserModel } from "@/models/users.model";
import { HttpException } from "@/exceptions/HttpException";

export class UserController {
  public user = Container.get(UserService);

  public getUserHandler = catchErrors(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    if (!user) throw new HttpException(404, "User not found");

    return res.status(200).json(user.omitPassword());
  });
}
