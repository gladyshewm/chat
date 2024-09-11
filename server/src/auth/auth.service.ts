import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { AUTH_REPOSITORY, AuthRepository } from './auth.repository';
import { USER_REPOSITORY, UserRepository } from '../users/users.repository';
import { AuthPayload, UserWithToken } from '../generated_graphql';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
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

  // TODO: тут в идеале транзакция
  async deleteUser(uuid: string): Promise<boolean> {
    try {
      const avatars = await this.userRepository.getUserAvatars(uuid);

      if (avatars && avatars.length > 0) {
        await Promise.all(
          avatars.map(async (file) => {
            const isRemoved = await this.userRepository.removeAvatarFromStorage(
              `profiles/${uuid}/${file.name}`,
            );

            if (!isRemoved) {
              throw new Error(
                `Не удалось удалить аватар из хранилища: ${file.name}`,
              );
            }
          }),
        );
      }

      await this.userRepository.deleteUserProfile(uuid);

      return this.authRepository.deleteUser(uuid);
    } catch (error) {
      this.logger.error('Ошибка при удалении пользователя:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

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
