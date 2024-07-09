import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Info, UserInfo } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('user')
  async getUser(): Promise<UserInfo> | null {
    return this.usersService.getUser();
  }

  @UseGuards(JWTAuthGuard)
  @Query('users')
  async getAllUsers(): Promise<Info[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @Mutation('uploadAvatar')
  async uploadAvatar(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Args('userUuid') userUuid: string,
  ) {
    return this.usersService.uploadAvatar(image, userUuid);
  }

  @Query('userAvatar')
  async getUserAvatar(@Args('userUuid') userUuid: string) {
    return this.usersService.getUserAvatar(userUuid);
  }
}
