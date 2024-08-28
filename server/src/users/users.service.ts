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
import { FilesService } from 'files/files.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly filesService: FilesService,
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
    const buffer = await this.filesService.readFile(file);
    const uniqueFilename = this.filesService.generateUniqueFilename(
      file.filename,
    );
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

  async getUserAvatar(userUuid: string): Promise<AvatarInfo | null> {
    const profile = await this.userRepository.getCurrentUserAvatar(userUuid);

    if (!profile || !profile.url) {
      this.logger.warn('Аватар пользователя не найден');
      return null;
    }

    return {
      url: profile.url,
      name: profile.name,
      createdAt: profile.created_at,
    };
  }

  async getUserAllAvatars(userUuid: string): Promise<AvatarInfo[]> {
    const avatars = await this.userRepository.getUserAvatars(userUuid);

    const avatarsInfo = await Promise.all(
      avatars.map(async (file) => {
        const publicUrl = await this.userRepository.getAvatarPublicUrl(
          userUuid,
          file.name,
        );
        return {
          url: publicUrl,
          name: file.name,
          createdAt: new Date(file.created_at),
        };
      }),
    );

    return avatarsInfo;
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

      const avatarPathToDelete = avatarUrl.split('/').slice(-3).join('/');
      await this.userRepository.removeAvatarFromStorage(avatarPathToDelete);

      const isActiveAvatar = currentAvatar.url === avatarUrl;
      if (!isActiveAvatar) return currentAvatar.url;

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
