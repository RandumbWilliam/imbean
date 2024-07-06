import { User } from "../interfaces/users.interface";
import { UserModel } from "../models/users.model";
import { HttpException } from "../exceptions/HttpException";
import { hash, verify } from "argon2";
import { Service } from "typedi";
import { sign } from "jsonwebtoken";
import { DataStoredInToken, TokenData } from "interfaces/auth.interface";

const createToken = (user: User): TokenData => {
  const dataStoredIntoken = { _id: user._id };
  const expiresIn: number = 1000 * 60 * 60 * 24;

  return {
    expiresIn,
    token: sign(dataStoredIntoken, "keyboardcat", { expiresIn }),
  };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<{ cookie: string; user: User }> {
    const findUser: User | null = await UserModel.findOne({
      email: userData.email,
    });
    if (findUser) throw new HttpException(409, "Account already exists.");

    const hashedPassword = await hash(userData.password);
    const createUserData: User = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    const tokenData = createToken(createUserData);
    const cookie = createCookie(tokenData);

    return { cookie, user: createUserData };
  }

  public async login(userData: User): Promise<{ cookie: string; user: User }> {
    const findUser: User | null = await UserModel.findOne({
      email: userData.email,
    });
    if (!findUser) throw new HttpException(409, "Account does not exist.");

    const isValidPassword = await verify(userData.password, findUser.password);
    if (!isValidPassword) throw new HttpException(409, "Invalid password.");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, user: findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User | null = await UserModel.findOne({
      email: userData.email,
    });
    if (!findUser) throw new HttpException(409, "Accoutn does not exist.");

    return findUser;
  }
}
