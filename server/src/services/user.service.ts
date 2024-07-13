import { UserModel } from "models/users.model";
import { Service } from "typedi";

@Service()
export class UserService {
  public async getUsers(loggedInUserId: string) {
    const filteredUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
    });

    return filteredUsers;
  }
}
