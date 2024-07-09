import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FileUpload } from 'graphql-upload-ts';
import { Info, UserInfo } from 'src/graphql';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async getUser(): Promise<UserInfo> | null {
    try {
      const {
        data: { session },
      } = await this.supabaseService.getClient().auth.getSession();
      if (session) {
        const { user } = session;
        return {
          uuid: user.id,
          name: user.user_metadata.name,
          email: user.email,
        };
      }
      return null;
    } catch (error) {
      console.error('Ошибка получения пользователя:', error.message);
      throw error;
    }
  }

  async findAll(): Promise<Info[]> {
    const { data: users, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('id, name');
    if (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return users;
  }

  async uploadAvatar(file: FileUpload, userUuid: string): Promise<string> {
    const { createReadStream, filename, mimetype, encoding } = file;
    const stream = createReadStream();

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const avatarName = `${userUuid}-avatar.${fileExtension}`;

    const { data, error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(`${userUuid}/${avatarName}`, buffer, {
        contentType: mimetype,
        upsert: true,
      });
    if (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const { data: dataPublicURL } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(`${userUuid}/${avatarName}`);

      const publicURL = dataPublicURL.publicUrl;
      await this.updateProfileAvatar(userUuid, publicURL);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return data.path;
  }

  private async updateProfileAvatar(userId: string, publicURL: string) {
    const { error: updateError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({ avatar_url: publicURL })
      .eq('uuid', userId);

    if (updateError) {
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!profile.avatar_url) {
      return null;
    }
    return profile.avatar_url;
  }
}
