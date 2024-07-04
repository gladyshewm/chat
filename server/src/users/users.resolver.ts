import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Info, User, UserInfo } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  /* @Query('user')
  public async getUser() {
    return this.usersService.findAll();
  } */

  @UseGuards(JWTAuthGuard)
  @Query('users')
  async getAllUsers(): Promise<Info[]> {
    return this.usersService.findAll();
  }

  /* @Query()
  async getUser(@Args('id') id: number) {
    return this.usersService.findOneById(id);
  } */
}
