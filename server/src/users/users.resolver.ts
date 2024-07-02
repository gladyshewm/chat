import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserInfo } from 'src/graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  /* @Query('user')
  public async getUser() {
    return this.usersService.findAll();
  } */

  @Query('users')
  public async getAllUsers(): Promise<UserInfo[]> {
    return this.usersService.findAll();
  }

  /* @Query()
  async getUser(@Args('id') id: number) {
    return this.usersService.findOneById(id);
  } */
}
