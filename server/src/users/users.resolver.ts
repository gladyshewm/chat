import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserWithToken, UserWithAvatar } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('user')
  async getUser(): Promise<UserWithToken> | null {
    return this.usersService.getUser();
  }

  @UseGuards(JWTAuthGuard)
  @Query('users')
  async getAllUsers(): Promise<UserWithAvatar[]> {
    return this.usersService.getAll();
  }

  @UseGuards(JWTAuthGuard)
  @Query('findUsers')
  async findUsers(@Args('input') input: string): Promise<UserWithAvatar[]> {
    return this.usersService.findUsers(input);
  }

  @UseGuards(JWTAuthGuard)
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

  @UseGuards(JWTAuthGuard)
  @Query('userAllAvatars')
  async getUserAllAvatars(@Args('userUuid') userUuid: string) {
    return this.usersService.getUserAllAvatars(userUuid);
  }
}
