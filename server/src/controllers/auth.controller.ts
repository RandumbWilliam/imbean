import { Request, Response } from "express";
import { Container } from "typedi";
import { AuthService } from "@services/auth.service";
import { catchErrors } from "@utils/catchErrors";
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from "@dtos/users.dto";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "@utils/cookies";
import { verifyToken } from "@utils/jwt";
import { SessionModel } from "@models/sessions.model";
import { HttpException } from "@exceptions/HttpException";

export class AuthController {
  public auth = Container.get(AuthService);

  public registerHandler = catchErrors(async (req, res, next) => {
    const userData: CreateUserDto = req.body;

    const { user, accessToken, refreshToken } =
      await this.auth.register(userData);

    return setAuthCookies({ res, accessToken, refreshToken })
      .status(201)
      .json(user);
  });

  public loginHandler = catchErrors(async (req, res, next) => {
    const userData: LoginUserDto = req.body;

    const { user, accessToken, refreshToken } = await this.auth.login(userData);

    return setAuthCookies({ res, accessToken, refreshToken })
      .status(200)
      .json(user);
  });

  public logoutHandler = catchErrors(async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    const { payload } = verifyToken(accessToken || "");

    if (payload) {
      await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res)
      .status(200)
      .json({ message: "Logout successful" });
  });

  public refreshHandler = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) throw new HttpException(401, "Missing refresh token");

    const { accessToken, newRefreshToken } =
      await this.auth.refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
      res.cookie(
        "refreshToken",
        newRefreshToken,
        getRefreshTokenCookieOptions(),
      );
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({
        message: "Access token refreshed",
      });
  });

  public sendPasswordResetHandler = catchErrors(async (req, res) => {
    const { email } = req.body;

    await this.auth.sendPasswordResetEmail(email);

    return res.status(200).json({ message: "Password reset email sent" });
  });

  public resetPasswordHandler = catchErrors(async (req, res) => {
    const resetPasswordData: ResetPasswordDto = req.body;

    await this.auth.resetPassword(resetPasswordData);

    return clearAuthCookies(res)
      .status(200)
      .json({ message: "Password reset successful" });
  });
}
