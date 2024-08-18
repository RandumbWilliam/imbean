import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@constants';
import { CreateUserDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { SessionModel } from '@models/sessions.model';
import { AuthService } from '@services/auth.service';
import { catchErrors } from '@utils/catchErrors';
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from '@utils/cookies';
import { verifyAccessToken } from '@utils/jwt';
import { Container } from 'typedi';

export class AuthController {
  public auth = Container.get(AuthService);

  public registerHandler = catchErrors(async (req, res) => {
    const userData: CreateUserDto = req.body;
    const userAgent = req.headers['user-agent'];

    const { user, accessToken, refreshToken } = await this.auth.register(userData, userAgent);

    return setAuthCookies({ res, accessToken, refreshToken }).status(201).json({
      user,
    });
  });

  public loginHandler = catchErrors(async (req, res) => {
    const userData: LoginUserDto = req.body;
    const userAgent = req.headers['user-agent'];

    const { user, accessToken, refreshToken } = await this.auth.login(userData, userAgent);

    return setAuthCookies({ res, accessToken, refreshToken }).status(200).json({
      user,
    });
  });

  public logoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    const { payload } = verifyAccessToken(accessToken || '');

    if (payload) {
      await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res).json({ message: 'Logout successful' });
  });

  public refreshHandler = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) throw new HttpException(401, 'Missing refresh token');

    const { accessToken, newRefreshToken } = await this.auth.refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, getRefreshTokenCookieOptions());
    }

    return res.status(200).cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, getAccessTokenCookieOptions()).json({
      message: 'Access token refreshed',
    });
  });

  public sendPasswordResetHandler = catchErrors(async (req, res) => {
    const { email }: ForgotPasswordDto = req.body;

    await this.auth.sendPasswordResetEmail(email);

    return res.status(200).json({ message: 'Password reset email sent' });
  });

  public resetPasswordHandler = catchErrors(async (req, res) => {
    const resetPasswordData: ResetPasswordDto = req.body;

    await this.auth.resetPassword(resetPasswordData);

    return clearAuthCookies(res).status(200).json({ message: 'Password reset successful' });
  });
}
