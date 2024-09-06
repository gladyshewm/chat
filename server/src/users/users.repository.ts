import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SupabaseResponse, SupabaseService } from 'supabase/supabase.service';
import { AvatarInfoData, UserWithAvatarData } from './models/users.model';
import { FileObject } from '@supabase/storage-js';
import { ChangeCredentialsInput, UserInfo } from 'generated_graphql';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  // users
  getUser(userUuid: string): Promise<UserWithAvatarData | null>;
  getAllUsers(): Promise<UserWithAvatarData[]>;
  findUsers(input: string, userUuid: string): Promise<UserWithAvatarData[]>;
  changeCredentials(
    userUuid: string,
    credentials: ChangeCredentialsInput,
  ): Promise<UserInfo>;
  deleteUserProfile(userUuid: string): Promise<void>;
  // avatars
  uploadAvatarToUserStorage(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
  ): Promise<void>;
  getAvatarPublicUrl(userUuid: string, filename: string): Promise<string>;
  getUserAvatarMetadata(
    filename: string,
    userUuid: string,
  ): Promise<string | null>;
  updateProfileAvatar(userId: string, publicURL: string | null): Promise<void>;
  getCurrentUserAvatar(userUuid: string): Promise<AvatarInfoData | null>;
  getUserAvatars(userUuid: string): Promise<FileObject[]>;
  removeAvatarFromStorage(avatarPath: string): Promise<boolean>;
}

@Injectable()
export class SupabaseUserRepository implements UserRepository {
  private readonly logger = new Logger(SupabaseUserRepository.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getUser(userUuid: string): Promise<UserWithAvatarData | null> {
    const response = (await this.supabaseService
      .getClient()
      .from('profiles')
      .select(
        `
          uuid,
          name,
          avatar_url
        `,
      )
      .eq('uuid', userUuid)
      .single()) as SupabaseResponse<UserWithAvatarData>;

    return this.supabaseService.handleSupabaseResponse(response);
  }

  async getAllUsers(): Promise<UserWithAvatarData[]> {
    const response = (await this.supabaseService
      .getClient()
      .from('profiles')
      .select('uuid, name, avatar_url')) as SupabaseResponse<
      UserWithAvatarData[]
    >;

    const users = this.supabaseService.handleSupabaseResponse(response);

    if (!users) {
      this.logger.warn('Пользователи не найдены');
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async findUsers(
    input: string,
    userUuid: string,
  ): Promise<UserWithAvatarData[]> {
    const response = (await this.supabaseService
      .getClient()
      .from('profiles')
      .select('uuid, name, avatar_url')
      .ilike('name', `%${input}%`)) as SupabaseResponse<UserWithAvatarData[]>;

    const foundUsers = this.supabaseService.handleSupabaseResponse(response);

    if (!foundUsers) {
      this.logger.warn('Пользователи не найдены');
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }

    return foundUsers.filter((user) => user.uuid !== userUuid);
  }

  async changeCredentials(
    userUuid: string,
    credentials: ChangeCredentialsInput,
  ): Promise<UserInfo> {
    try {
      const response = (await this.supabaseService
        .getClient()
        .rpc('change_user_credentials', {
          p_user_uuid: userUuid,
          p_name: credentials.name,
          p_email: credentials.email,
          p_password: credentials.password,
        })) as SupabaseResponse<UserInfo>;

      const data = this.supabaseService.handleSupabaseResponse(response);

      if (!data) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      return data;
    } catch (error) {
      this.logger.error(
        'Ошибка вызова функции обновления учетных данных:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUserProfile(userUuid: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({ is_deleted: true })
      .eq('uuid', userUuid);

    if (error) {
      this.logger.error('Ошибка удаления профиля:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadAvatarToUserStorage(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error('Ошибка загрузки аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAvatarPublicUrl(
    userUuid: string,
    filename: string,
  ): Promise<string> {
    try {
      const { data } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(`profiles/${userUuid}/${filename}`);

      return data.publicUrl;
    } catch (error) {
      this.logger.error(
        'Ошибка получения публичного URL для аватара пользователя:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserAvatarMetadata(
    filename: string,
    userUuid: string,
  ): Promise<string | null> {
    try {
      const filePath = `profiles/${userUuid}/${filename}`;

      const { data: fileMetadata, error } = (await this.supabaseService
        .getClient()
        .schema('storage')
        .from('objects')
        .select('created_at')
        .eq('name', filePath)
        .single()) as SupabaseResponse<{ created_at: string }>;

      if (error) {
        this.logger.error(
          'Ошибка получения метаданных для аватара из хранилища:',
          error.message,
        );
        return null;
      }

      if (!fileMetadata) {
        this.logger.warn('Не удалось найти метаданные аватара пользователя');
        return null;
      }

      return fileMetadata.created_at;
    } catch (error) {
      this.logger.error(
        'Ошибка получения метаданных для аватара пользователя:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProfileAvatar(
    userId: string,
    publicURL: string | null,
  ): Promise<void> {
    const { error: updateError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({ avatar_url: publicURL })
      .eq('uuid', userId);

    if (updateError) {
      this.logger.error('Ошибка обновления аватара:', updateError.message);
      throw new HttpException(
        updateError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCurrentUserAvatar(userUuid: string): Promise<AvatarInfoData | null> {
    const { data: profile, error } = (await this.supabaseService
      .getClient()
      .from('profiles')
      .select('avatar_url')
      .eq('uuid', userUuid)
      .single()) as SupabaseResponse<{ avatar_url: string }>;

    if (error) {
      this.logger.error(
        'Ошибка получения аватара пользователя:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!profile || !profile.avatar_url) return null;

    const fileName = profile.avatar_url.split('/').pop();

    if (!fileName) {
      this.logger.error('Не удалось извлечь имя файла из URL аватара');
      throw new HttpException(
        'Не удалось извлечь имя файла из URL аватара',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const createdAt = await this.getUserAvatarMetadata(fileName, userUuid);

    if (!createdAt) return null;

    return {
      url: profile.avatar_url,
      name: fileName,
      created_at: new Date(createdAt),
    };
  }

  async getUserAvatars(userUuid: string): Promise<FileObject[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .list(`profiles/${userUuid}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        this.logger.error('Ошибка получения аватаров:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data;
    } catch (error) {
      this.logger.error(
        'Ошибка получения списка аватаров пользователя:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeAvatarFromStorage(avatarPath: string): Promise<boolean> {
    const { data, error: deleteError } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .remove([avatarPath]);

    if (deleteError) {
      this.logger.error(`Ошибка удаления аватара: ${deleteError.message}`);
      throw new HttpException(
        deleteError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return !!data;
  }
}
