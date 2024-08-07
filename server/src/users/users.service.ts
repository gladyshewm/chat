import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUpload } from 'graphql-upload-ts';
import {
  UserWithAvatar,
  AvatarInfo,
  ChangeCredentialsInput,
  UserInfo,
} from '../graphql';
import { AvatarInfoData } from './types/users.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabaseService: SupabaseService) {}

  async getAllUsers(): Promise<UserWithAvatar[]> {
    const { data: users, error } = await this.supabaseService
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

  async findUsers(input: string): Promise<UserWithAvatar[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('uuid, name, avatar_url')
      .ilike('name', `%${input}%`);

    if (error) {
      this.logger.error('Ошибка поиска пользователей:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const allUsers = data.map((user) => {
      return { id: user.uuid, name: user.name, avatarUrl: user.avatar_url };
    });

    return allUsers;
  }

  async uploadAvatar(file: FileUpload, userUuid: string): Promise<AvatarInfo> {
    const buffer = await this.readFile(file);
    const uniqueFilename = this.generateUniqueFilename(file.filename);

    await this.uploadAvatarToUserStorage(
      buffer,
      uniqueFilename,
      file.mimetype,
      userUuid,
    );

    const publicURL = await this.getAvatarPublicUrl(uniqueFilename, userUuid);

    await this.updateProfileAvatar(userUuid, publicURL);

    const createdAt = await this.getUserAvatarMetadata(
      uniqueFilename,
      userUuid,
    );

    if (!createdAt) {
      this.logger.error('Не удалось получить метаданные файла');
      throw new HttpException(
        'Не удалось получить метаданные файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      url: publicURL,
      name: uniqueFilename,
      createdAt: new Date(createdAt),
    };
  }

  private async readFile(file: FileUpload): Promise<Buffer> {
    const { createReadStream } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  private generateUniqueFilename(filename: string): string {
    const fileExtension = filename.split('.').pop();
    return `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
  }

  private async uploadAvatarToUserStorage(
    buffer: Buffer,
    filename: string,
    mimetype: string,
    userUuid: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(`profiles/${userUuid}/${filename}`, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error('Ошибка загрузки аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getAvatarPublicUrl(
    filename: string,
    userUuid: string,
  ): Promise<string> {
    try {
      const { data } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(`profiles/${userUuid}/${filename}`);

      return data.publicUrl;
    } catch (error) {
      this.logger.error('Ошибка получения публичного URL:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async updateProfileAvatar(
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

  private async getUserAvatarMetadata(
    filename: string,
    userUuid: string,
  ): Promise<string | null> {
    const filePath = `profiles/${userUuid}/${filename}`;

    const { data: fileMetadata, error: metadataError } =
      await this.supabaseService
        .getClient()
        .schema('storage')
        .from('objects')
        .select('created_at')
        .eq('name', filePath);

    if (metadataError) {
      this.logger.error('Ошибка получения метаданных:', metadataError.message);
      throw new HttpException(
        metadataError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!fileMetadata[0]) {
      this.logger.warn('Не удалось получить метаданные аватара пользователя');
      return null;
    }

    return fileMetadata[0].created_at;
  }

  async getUserAvatar(userUuid: string): Promise<AvatarInfo | null> {
    const { data: profile, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('avatar_url')
      .eq('uuid', userUuid)
      .single();

    if (error) {
      this.logger.warn('Ошибка получения аватара:', error.message);
      return null;
    }

    if (!profile.avatar_url) return null;

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
      createdAt: new Date(createdAt),
    };
  }

  async getUserAllAvatars(userUuid: string): Promise<AvatarInfo[]> {
    try {
      const { data, error } = (await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .list(`profiles/${userUuid}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        })) as unknown as { data: AvatarInfoData[]; error: any };

      if (error) {
        this.logger.error('Ошибка получения аватаров:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const avatarsInfo = await Promise.all(
        data.map(async (file) => {
          const publicUrl = await this.getAvatarPublicUrl(file.name, userUuid);
          return {
            url: publicUrl,
            name: file.name,
            createdAt: file.created_at,
          };
        }),
      );

      return avatarsInfo;
    } catch (error) {
      this.logger.error('Ошибка получения публичных URL:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAvatar(
    userUuid: string,
    avatarUrl: string,
  ): Promise<string | null> {
    try {
      const currentAvatar = await this.getCurrentProfileAvatar(userUuid);

      if (!currentAvatar) {
        this.logger.error('Не удалось получить текущий аватар');
        return null;
      }

      const isActiveAvatar = currentAvatar?.avatar_url === avatarUrl;
      if (!isActiveAvatar) return currentAvatar.avatar_url;

      const avatarPathToDelete = avatarUrl.split('/').slice(-3).join('/');
      await this.removeAvatarFromStorage(avatarPathToDelete);

      const files = await this.listUserAvatars(userUuid);

      let newAvatarUrl: string;

      if (files && files.length > 0) {
        const lastFile = files.sort((a, b) =>
          String(b.created_at).localeCompare(String(a.created_at)),
        )[0];

        const publicUrlData = await this.getAvatarPublicUrl(
          lastFile.name,
          userUuid,
        );

        newAvatarUrl = publicUrlData;

        if (!newAvatarUrl) {
          this.logger.error('Не удалось получить публичный URL');
          return null;
        }

        await this.updateProfileAvatar(userUuid, newAvatarUrl);

        return newAvatarUrl;
      } else {
        await this.updateProfileAvatar(userUuid, null);
        return currentAvatar.avatar_url;
      }
    } catch (error) {
      this.logger.error('Ошибка удаления аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getCurrentProfileAvatar(
    userUuid: string,
  ): Promise<{ avatar_url: string } | null> {
    const { data: currentAvatar, error: fetchError } =
      await this.supabaseService
        .getClient()
        .from('profiles')
        .select('avatar_url')
        .eq('uuid', userUuid)
        .single();

    if (fetchError) {
      this.logger.error(`Ошибка получения аватара: ${fetchError.message}`);
      throw new HttpException(
        fetchError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!currentAvatar) {
      return null;
    }

    return currentAvatar;
  }

  private async removeAvatarFromStorage(avatarPath: string): Promise<void> {
    const { error: deleteError } = await this.supabaseService
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
  }

  private async listUserAvatars(userUuid: string): Promise<AvatarInfoData[]> {
    const { data: files, error: listError } = (await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .list(`profiles/${userUuid}`)) as unknown as {
      data: AvatarInfoData[];
      error: any;
    };

    if (listError) {
      this.logger.error(`Ошибка получения списка файлов: ${listError.message}`);
      throw new HttpException(
        listError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return files;
  }

  async changeCredentials(
    userUuid: string,
    credentials: ChangeCredentialsInput,
  ): Promise<UserInfo> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .rpc('change_user_credentials', {
          p_user_uuid: userUuid,
          p_name: credentials.name,
          p_email: credentials.email,
          p_password: credentials.password,
        });

      if (error) {
        this.logger.error('Ошибка обновления учетных данных:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!data) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      return {
        uuid: data.uuid,
        name: data.name,
        email: data.email,
      };
    } catch (error) {
      this.logger.error(
        'Ошибка вызова функции обновления учетных данных:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
