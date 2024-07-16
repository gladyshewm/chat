import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUpload } from 'graphql-upload-ts';
import { UserWithToken, UserWithAvatar } from 'src/graphql';
import { User } from './types/users.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabaseService: SupabaseService) {}

  async getUser(): Promise<UserWithToken> | null {
    try {
      const {
        data: { session },
      } = await this.supabaseService.getClient().auth.getSession();
      if (session) {
        const { user: userSession } = session;
        return {
          user: {
            uuid: userSession.id,
            name: userSession.user_metadata.name,
            email: userSession.email,
          },
          token: session.access_token,
        };
      }
      return null;
    } catch (error) {
      this.logger.error('Ошибка получения пользователя:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<UserWithAvatar[]> {
    const { data: users, error }: { data: User[]; error: any } =
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
    const { data, error }: { data: User[]; error: any } =
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

  async uploadAvatar(file: FileUpload, userUuid: string): Promise<string> {
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

    try {
      const { data: dataPublicURL } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(`profiles/${userUuid}/${uniqueFilename}`);

      const publicURL = dataPublicURL.publicUrl;
      await this.updateProfileAvatar(userUuid, publicURL);

      return publicURL;
    } catch (error) {
      this.logger.error('Ошибка получения публичного URL:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async getUserAvatar(userUuid: string): Promise<string> {
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

    return profile.avatar_url;
  }

  async getUserAllAvatars(userUuid: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .list(`profiles/${userUuid}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        this.logger.error('Ошибка получения аватаров:', error.message);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const avatarUrls = await Promise.all(
        data.map(async (file) => {
          const { data } = await this.supabaseService
            .getClient()
            .storage.from('avatars')
            .getPublicUrl(`profiles/${userUuid}/${file.name}`);

          return data.publicUrl;
        }),
      );

      return avatarUrls;
    } catch (error) {
      this.logger.error('Ошибка получения публичных URL:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAvatar(userUuid: string): Promise<string> | null {
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

      if (!currentAvatar?.avatar_url) return null;

      const currentAvatarPath = currentAvatar.avatar_url
        .split('/')
        .slice(-3)
        .join('/');

      const { error: deleteError } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .remove([currentAvatarPath]);

      if (deleteError) {
        this.logger.error(`Ошибка удаления аватара: ${deleteError.message}`);
        throw new HttpException(
          deleteError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

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
        this.logger.error(`Ошибка обновления аватара: ${updateError.message}`);
        throw new HttpException(
          updateError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newAvatarUrl;
    } catch (error) {
      this.logger.error('Ошибка удаления аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
