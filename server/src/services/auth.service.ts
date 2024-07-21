import { UserModel } from "@models/users.model";
import { HttpException } from "@exceptions/HttpException";
import { Service } from "typedi";
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import { SessionModel } from "@models/sessions.model";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "@utils/jwt";
import { TokenModel } from "@models/tokens.model";
import { APP_ORIGIN } from "@config";
import { sendMail } from "@utils/resend";
import { hashValue } from "@utils/argon2";

@Service()
export class AuthService {
  public async register(userData: CreateUserDto) {
    const existingUser = await UserModel.exists({
      email: userData.email,
    });
    if (existingUser) throw new HttpException(409, "Account already exists.");

    const user = await UserModel.create(userData);

    const session = await SessionModel.create({
      userId: user._id,
    });

    const refreshToken = signToken(
      { sessionId: session._id },
      refreshTokenSignOptions,
    );

    const accessToken = signToken({ userId: user._id, sessionId: session._id });

    return { user: user.omitPassword(), accessToken, refreshToken };
  }

  public async login(userData: LoginUserDto) {
    const user = await UserModel.findOne({ email: userData.email });
    if (!user) throw new HttpException(409, "Invalid email or password.");

    const isValid = user.verifyPassword(userData.password);
    if (!isValid) throw new HttpException(409, "Invalid email or password.");

    const session = await SessionModel.create({
      userId: user._id,
    });

    const refreshToken = signToken(
      { sessionId: session._id },
      refreshTokenSignOptions,
    );

    const accessToken = signToken({ userId: user._id, sessionId: session._id });

    return { user: user.omitPassword(), accessToken, refreshToken };
  }

  public async refreshUserAccessToken(refreshToken: string) {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });
    if (!payload) throw new HttpException(401, "Invalid refresh token");

    const session = await SessionModel.findById(payload.sessionId);
    if (!session || session.expiresAt.getTime() < Date.now())
      throw new HttpException(401, "Session expired");

    const sessionNeedsRefresh =
      session.expiresAt.getTime() - Date.now() <= 1000 * 60 * 60 * 24;
    if (sessionNeedsRefresh) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
      ? signToken(
          {
            sessionId: session._id,
          },
          refreshTokenSignOptions,
        )
      : undefined;

    const accessToken = signToken({
      userId: session.userId,
      sessionId: session._id,
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async sendPasswordResetEmail(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new HttpException(404, "User not found");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
    const token = await TokenModel.create({
      userId: user._id,
      type: "password_reset",
      expiresAt,
    });

    const url = `${APP_ORIGIN}/password/reset?token=${token._id}&exp=${expiresAt.getTime()}`;
    const { data, error } = await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click here on the link to reset your password: ${url}`,
      html: `<a target="_blank" href="${url}">Click here</a>`,
    });

    if (!data?.id)
      throw new HttpException(400, `${error?.name} - ${error?.message}`);

    return {
      url,
      emailId: data.id,
    };
  }

  public async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) {
    const validToken = await TokenModel.findOne({
      _id: token,
      type: "password_reset",
      expiresAt: { $gt: new Date() },
    });

    if (!validToken) throw new HttpException(404, "Invalid or expired token");

    const updatedUser = await UserModel.findByIdAndUpdate(validToken.userId, {
      password: await hashValue(password),
    });

    if (!updatedUser) throw new HttpException(500, "Failed to reset password");

    await validToken.deleteOne();

    await SessionModel.deleteMany({
      userId: updatedUser._id,
    });

    return {
      user: updatedUser?.omitPassword(),
    };
  }
}
