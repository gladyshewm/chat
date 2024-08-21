import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import {
  UserWithAvatar,
  AvatarInfo,
  ChangeCredentialsInput,
  UserInfo,
} from '../graphql';
import { UserWithAvatarData } from './models/users.model';
import { USER_REPOSITORY, UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async getUser(userUuid: string): Promise<UserWithAvatarData> {
    const user = await this.userRepository.getUser(userUuid);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getAllUsers(): Promise<UserWithAvatar[]> {
    const users = await this.userRepository.getAllUsers();

    return users.map((user) => ({
      id: user.uuid,
      name: user.name,
      avatarUrl: user.avatar_url,
    }));
  }

  async findUsers(input: string, userUuid: string): Promise<UserWithAvatar[]> {
    const foundUsers = await this.userRepository.findUsers(input, userUuid);

    return foundUsers.map((user) => ({
      id: user.uuid,
      name: user.name,
      avatarUrl: user.avatar_url,
    }));
  }

  async uploadAvatar(file: FileUpload, userUuid: string): Promise<AvatarInfo> {
    const buffer = await this.readFile(file);
    const uniqueFilename = this.generateUniqueFilename(file.filename);
    const filePath = `profiles/${userUuid}/${uniqueFilename}`;

    await this.userRepository.uploadAvatarToUserStorage(
      buffer,
      filePath,
      file.mimetype,
    );

    const publicURL = await this.userRepository.getAvatarPublicUrl(
      userUuid,
      uniqueFilename,
    );

    await this.userRepository.updateProfileAvatar(userUuid, publicURL);

    const createdAt = await this.userRepository.getUserAvatarMetadata(
      uniqueFilename,
      userUuid,
    );

    if (!createdAt) {
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

  // FIXME: create FileService?
  private async readFile(file: FileUpload): Promise<Buffer> {
    const { createReadStream } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  //FIXME: повторяется (в chatService)
  private generateUniqueFilename(filename: string): string {
    const fileExtension = filename.split('.').pop();
    return `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
  }

  async getUserAvatar(userUuid: string): Promise<AvatarInfo | null> {
    const profile = await this.userRepository.getCurrentUserAvatar(userUuid);

    if (!profile)
      throw new HttpException('Аватар не найден', HttpStatus.NOT_FOUND);

    return {
      url: profile.url,
      name: profile.name,
      createdAt: profile.created_at,
    };
  }

  async getUserAllAvatars(userUuid: string): Promise<AvatarInfo[]> {
    const avatars = await this.userRepository.getUserAvatars(userUuid);

    return avatars.map((avatar) => ({
      url: avatar.url,
      name: avatar.name,
      createdAt: avatar.created_at,
    }));
  }

  async deleteAvatar(
    userUuid: string,
    avatarUrl: string,
  ): Promise<string | null> {
    try {
      const currentAvatar =
        await this.userRepository.getCurrentUserAvatar(userUuid);

      if (!currentAvatar) {
        this.logger.error('Не удалось получить текущий аватар');
        return null;
      }

      const isActiveAvatar = currentAvatar.url === avatarUrl;
      if (!isActiveAvatar) return currentAvatar.url;

      const avatarPathToDelete = avatarUrl.split('/').slice(-3).join('/');
      await this.userRepository.removeAvatarFromStorage(avatarPathToDelete);

      const files = await this.userRepository.getUserAvatars(userUuid);

      let newAvatarUrl: string;

      if (files && files.length > 0) {
        /* const lastFile = files.sort((a, b) =>
          String(b.created_at).localeCompare(String(a.created_at)),
        )[0]; */
        const lastFile = files[0];

        const publicUrlData = await this.userRepository.getAvatarPublicUrl(
          userUuid,
          lastFile.name,
        );

        newAvatarUrl = publicUrlData;

        if (!newAvatarUrl) {
          this.logger.error('Не удалось получить публичный URL');
          return null;
        }

        await this.userRepository.updateProfileAvatar(userUuid, newAvatarUrl);

        return newAvatarUrl;
      } else {
        await this.userRepository.updateProfileAvatar(userUuid, null);
        return currentAvatar.url;
      }
    } catch (error) {
      this.logger.error('Ошибка удаления аватара:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeCredentials(
    userUuid: string,
    credentials: ChangeCredentialsInput,
  ): Promise<UserInfo> {
    return this.userRepository.changeCredentials(userUuid, credentials);
  }
}
