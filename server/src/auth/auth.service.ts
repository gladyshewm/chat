import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import {
  AuthPayload,
  UserInfo,
  UserWithAvatar,
  UserWithToken,
} from 'src/graphql';
import { UserData } from 'src/users/types/users.types';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private supabaseService: SupabaseService) {}

  async refreshToken(): Promise<AuthPayload> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.refreshSession();

      if (error) {
        this.logger.error('Ошибка обновления сессии:', error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      const user = {
        uuid: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email,
      };

      return {
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      this.logger.error('Ошибка обновления токена:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(): Promise<UserWithToken> | null {
    try {
      const [{ data: userData }, { data: sessionData }] = await Promise.all([
        this.supabaseService.getClient().auth.getUser(),
        this.supabaseService.getClient().auth.getSession(),
      ]);

      if (!userData || !sessionData || userData.user === null) {
        return null;
      }

      if (sessionData.session === null) {
        throw new HttpException(
          'Сессия пользователя не найдена',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        user: {
          uuid: userData.user.id,
          name: userData.user.user_metadata.name,
          email: userData.user.email,
        },
        token: sessionData.session.access_token,
      };
    } catch (error) {
      this.logger.error('Ошибка получения пользователя:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(): Promise<UserWithAvatar[]> {
    const { data: users, error }: { data: UserData[]; error: any } =
      await this.supabaseService
        .getClient()
        .from('profiles')
        .select('uuid, name, avatar_url');

    if (error) {
      this.logger.error('Ошибка получения пользователей:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const allUsers = users.map((user) => {
      return { id: user.uuid, name: user.name, avatarUrl: user.avatar_url };
    });

    return allUsers;
  }

  async createUser(userInput: CreateUserDto): Promise<AuthPayload> {
    const profile_id: string = Date.now().toString();
    const { data, error: authError } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email: userInput.email,
        password: userInput.password,
        options: {
          data: {
            name: userInput.name,
            profile_id: profile_id,
          },
        },
      });
    if (authError) {
      this.logger.error('Ошибка при регистрации:', authError.message);
      throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);
    }

    const { error: profileError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .insert({
        id: profile_id,
        name: userInput.name,
        uuid: data.user.id,
      });

    if (profileError) {
      this.logger.error('Ошибка при регистрации:', profileError.message);
      throw new HttpException(profileError.message, HttpStatus.BAD_REQUEST);
    }

    const user: UserInfo = {
      uuid: profile_id,
      name: userInput.name,
      email: userInput.email,
    };

    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async logInUser(
    email: string,
    password: string,
    res: Response,
  ): Promise<AuthPayload> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        this.logger.error('Ошибка при входе в систему:', error.message);
        throw new UnauthorizedException({ message: error.message });
      }

      const user = {
        uuid: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email,
      };
      const { access_token, refresh_token } = data.session;

      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false, //SET TO TRUE IN PRODUCTION
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (error) {
      this.logger.error('Ошибка при входе в систему:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logOutUser(): Promise<boolean> {
    const { error } = await this.supabaseService.getClient().auth.signOut();
    if (error) {
      this.logger.error('Ошибка при выходе из системы:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
