import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserWithToken, UserWithAvatar } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { JwtHttpAuthGuard } from 'src/auth/guards/jwt-http-auth.guard';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('user')
  async getUser(): Promise<UserWithToken> | null {
    return this.usersService.getUser();
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('users')
  async getAllUsers(): Promise<UserWithAvatar[]> {
    return this.usersService.getAll();
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('findUsers')
  async findUsers(@Args('input') input: string): Promise<UserWithAvatar[]> {
    return this.usersService.findUsers(input);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('uploadAvatar')
  async uploadAvatar(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Args('userUuid') userUuid: string,
  ): Promise<string> {
    return this.usersService.uploadAvatar(image, userUuid);
  }

  @Query('userAvatar')
  async getUserAvatar(@Args('userUuid') userUuid: string) {
    return this.usersService.getUserAvatar(userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('userAllAvatars')
  async getUserAllAvatars(@Args('userUuid') userUuid: string) {
    return this.usersService.getUserAllAvatars(userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('deleteAvatar')
  async deleteChatAvatar(
    @Args('userUuid') userUuid: string,
  ): Promise<string> | null {
    return this.usersService.deleteAvatar(userUuid);
  }
}
