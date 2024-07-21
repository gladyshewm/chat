import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUpload } from 'graphql-upload-ts';
import {
  UserWithToken,
  UserWithAvatar,
  AvatarInfo,
  ChangeCredentialsInput,
  UserInfo,
} from 'src/graphql';
import { AvatarInfoData, UserData } from './types/users.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabaseService: SupabaseService) {}

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

  async getAll(): Promise<UserWithAvatar[]> {
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

  async findUsers(input: string): Promise<UserWithAvatar[]> {
    const { data, error }: { data: UserData[]; error: any } =
      await this.supabaseService
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
    const { createReadStream, filename, mimetype } = file;
    const stream = createReadStream();

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    const { error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(`profiles/${userUuid}/${uniqueFilename}`, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error('Ошибка загрузки аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let publicURL: string;
    try {
      const { data } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(`profiles/${userUuid}/${uniqueFilename}`);

      const dataPublicURL = data.publicUrl;
      await this.updateProfileAvatar(userUuid, dataPublicURL);
      publicURL = dataPublicURL;
    } catch (error) {
      this.logger.error('Ошибка получения публичного URL:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const filePath = `profiles/${userUuid}/${uniqueFilename}`;

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

    return {
      url: publicURL,
      name: uniqueFilename,
      createdAt: fileMetadata[0].created_at,
    };
  }

  private async updateProfileAvatar(userId: string, publicURL: string) {
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

  async getUserAvatar(userUuid: string): Promise<AvatarInfo | null> {
    const { data: profile, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('avatar_url')
      .eq('uuid', userUuid)
      .single();

    if (error) {
      this.logger.error('Ошибка получения аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!profile.avatar_url) return null;

    const fileName = profile.avatar_url.split('/').pop();
    const filePath = `profiles/${userUuid}/${fileName}`;

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

    return {
      url: profile.avatar_url,
      name: fileName,
      createdAt: fileMetadata[0].created_at,
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
        })) as { data: AvatarInfoData[]; error: any };

      if (error) {
        this.logger.error('Ошибка получения аватаров:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const avatarsInfo = await Promise.all(
        data.map(async (file) => {
          const { data } = await this.supabaseService
            .getClient()
            .storage.from('avatars')
            .getPublicUrl(`profiles/${userUuid}/${file.name}`);

          return {
            url: data.publicUrl,
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
  ): Promise<string> | null {
    try {
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

      const isActiveAvatar = currentAvatar?.avatar_url === avatarUrl;

      const avatarPathToDelete = avatarUrl.split('/').slice(-3).join('/');

      const { error: deleteError } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .remove([avatarPathToDelete]);

      if (deleteError) {
        this.logger.error(`Ошибка удаления аватара: ${deleteError.message}`);
        throw new HttpException(
          deleteError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (isActiveAvatar) {
        const { data: files, error: listError } = await this.supabaseService
          .getClient()
          .storage.from('avatars')
          .list(`profiles/${userUuid}`);

        if (listError) {
          this.logger.error(
            `Ошибка получения списка файлов: ${listError.message}`,
          );
          throw new HttpException(
            listError.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        let newAvatarUrl: string | null = null;
        if (files && files.length > 0) {
          const lastFile = files.sort((a, b) =>
            b.created_at.localeCompare(a.created_at),
          )[0];
          const { data: publicUrlData } = await this.supabaseService
            .getClient()
            .storage.from('avatars')
            .getPublicUrl(`profiles/${userUuid}/${lastFile.name}`);

          newAvatarUrl = publicUrlData.publicUrl;
        }

        const { error: updateError } = await this.supabaseService
          .getClient()
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('uuid', userUuid);

        if (updateError) {
          this.logger.error(
            `Ошибка обновления аватара: ${updateError.message}`,
          );
          throw new HttpException(
            updateError.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return newAvatarUrl;
      }

      return currentAvatar.avatar_url;
    } catch (error) {
      this.logger.error('Ошибка удаления аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
