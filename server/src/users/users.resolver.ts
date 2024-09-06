import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { JwtHttpAuthGuard } from '../auth/guards/jwt-http-auth.guard';
import {
  AvatarInfo,
  ChangeCredentialsInput,
  UserWithAvatar,
} from 'generated_graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtHttpAuthGuard)
  @Query('users')
  async getAllUsers(): Promise<UserWithAvatar[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('findUsers')
  async findUsers(
    @Args('input') input: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<UserWithAvatar[]> {
    return this.usersService.findUsers(input, userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('uploadAvatar')
  async uploadAvatar(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Context('user_uuid') userUuid: string,
  ): Promise<AvatarInfo> {
    return this.usersService.uploadAvatar(image, userUuid);
  }

  @Query('userAvatar')
  async getUserAvatar(
    @Args('userUuid') userUuid: string,
  ): Promise<AvatarInfo | null> {
    return this.usersService.getUserAvatar(userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('userAllAvatars')
  async getUserAllAvatars(
    @Args('userUuid') userUuid: string,
  ): Promise<AvatarInfo[]> {
    return this.usersService.getUserAllAvatars(userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('deleteAvatar')
  async deleteAvatar(
    @Context('user_uuid') userUuid: string,
    @Args('avatarUrl') avatarUrl: string,
  ): Promise<string | null> {
    return this.usersService.deleteAvatar(userUuid, avatarUrl);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('changeCredentials')
  async changeCredentials(
    @Context('user_uuid') userUuid: string,
    @Args('credentials') credentials: ChangeCredentialsInput,
  ) {
    return this.usersService.changeCredentials(userUuid, credentials);
  }
}
