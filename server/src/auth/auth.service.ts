import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthPayload, UserWithToken } from '../graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { AUTH_REPOSITORY, AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
  ) {}

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, //SET TO TRUE IN PRODUCTION (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async refreshToken(): Promise<AuthPayload> {
    return this.authRepository.refreshToken();
  }

  async getUser(token: string): Promise<UserWithToken | null> {
    return this.authRepository.getUser(token);
  }

  async createUser(userInput: CreateUserDto): Promise<AuthPayload> {
    const { name, email, password } = userInput;
    return this.authRepository.createUser(name, email, password);
  }

  //TODO: add delete user

  async logInUser(
    loginData: LoginUserDto,
    res: Response,
  ): Promise<AuthPayload> {
    try {
      const { email, password } = loginData;
      const data = await this.authRepository.logInUser(email, password);
      const { user, accessToken, refreshToken } = data;

      this.setRefreshTokenCookie(res, refreshToken);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Ошибка при входе в систему:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logOutUser(): Promise<boolean> {
    return this.authRepository.logOutUser();
  }
}
