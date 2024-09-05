import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Session, User } from '@supabase/supabase-js';
import { AuthPayload, UserInfo, UserWithToken } from 'generated_graphql';
import { SupabaseService } from 'supabase/supabase.service';

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';

export interface AuthRepository {
  refreshToken(): Promise<AuthPayload>;
  getUser(token: string): Promise<UserWithToken | null>;
  createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthPayload>;
  logInUser(email: string, password: string): Promise<AuthPayload>;
  logOutUser(): Promise<boolean>;
  deleteUser(uuid: string): Promise<boolean>;
}

@Injectable()
export class SupabaseAuthRepository implements AuthRepository {
  private readonly logger = new Logger(SupabaseAuthRepository.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async refreshToken(): Promise<AuthPayload> {
    try {
      const response = await this.supabaseService
        .getClient()
        .auth.refreshSession();

      const data = this.supabaseService.handleSupabaseAuthResponse(response);

      if (!data || !data.user) {
        this.logger.error('Ошибка обновления токена: пользователь не найден');
        throw new UnauthorizedException();
      }

      if (!data.session) {
        this.logger.error('Ошибка обновления токена: сессия не найдена');
        throw new UnauthorizedException();
      }

      const user = {
        uuid: data.user.id,
        name: data.user.user_metadata.name,
        email: data.user.email as string,
      };

      this.logger.log('Токен успешно обновлён');

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

  async getUser(token: string): Promise<UserWithToken | null> {
    try {
      const response = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      const userData = this.supabaseService.handleSupabaseAuthResponse<{
        user: User | null;
      }>(response);

      if (!userData || userData.user === null) {
        this.logger.error(
          'Ошибка получения пользователя: пользователь не найден',
        );
        return null;
      }

      return {
        user: {
          uuid: userData.user.id,
          name: userData.user.user_metadata.name,
          email: userData.user.email as string,
        },
        token: token,
      };
    } catch (error) {
      this.logger.error('Ошибка получения пользователя:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthPayload> {
    const profile_id = Date.now().toString();

    const response = await this.supabaseService.getClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_id,
        },
      },
    });

    const data = this.supabaseService.handleSupabaseAuthResponse(response);

    if (!data || !data.user) {
      this.logger.error('Ошибка при регистрации: пользователь не создан');
      throw new HttpException('User not createdf', HttpStatus.BAD_REQUEST);
    }

    if (!data.session) {
      this.logger.error('Ошибка при регистрации: сессия не создана');
      throw new HttpException('Session not created', HttpStatus.BAD_REQUEST);
    }

    await this.createUserProfile(data.user.id, profile_id, name);

    const user: UserInfo = {
      uuid: data.user.id,
      name,
      email,
    };

    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  private async createUserProfile(
    userUuid: string,
    profileId: string,
    userName: string,
  ): Promise<void> {
    const { error: profileError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .insert({
        id: profileId,
        name: userName,
        uuid: userUuid,
      });

    if (profileError) {
      this.logger.error('Ошибка при регистрации:', profileError.message);
      throw new HttpException(profileError.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logInUser(email: string, password: string): Promise<AuthPayload> {
    const response = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    const data = this.supabaseService.handleSupabaseAuthResponse<{
      user: User | null;
      session: Session | null;
    }>(response);

    if (!data || data.user === null) {
      this.logger.error('Ошибка при входе в систему: пользователь не найден');
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (!data.session) {
      this.logger.error('Ошибка при входе в систему: сессия не найдена');
      throw new HttpException('Session not found', HttpStatus.BAD_REQUEST);
    }

    const user = {
      uuid: data.user.id,
      name: data.user.user_metadata.name,
      email: data.user.email as string,
    };
    const { access_token, refresh_token } = data.session;

    return {
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async logOutUser(): Promise<boolean> {
    const response = await this.supabaseService.getClient().auth.getSession();

    const session = this.supabaseService.handleSupabaseAuthResponse<{
      session: Session | null;
    }>(response);

    if (!session || !session.session) {
      this.logger.warn('Попытка выхода не авторизованного пользователя');
      return false;
    }

    const { error: signOutError } = await this.supabaseService
      .getClient()
      .auth.signOut({ scope: 'local' });

    if (signOutError) {
      this.logger.error(
        'Ошибка при попытке выхода из системы:',
        signOutError.message,
      );
      throw new HttpException(signOutError.message, HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  async deleteUser(uuid: string): Promise<boolean> {
    const shouldSoftDelete = true;

    const { data, error } = await this.supabaseService
      .getAdminClient()
      .auth.admin.deleteUser(uuid, shouldSoftDelete);

    if (error) {
      this.logger.error('Ошибка при удалении пользователя:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return !!data;
  }
}
