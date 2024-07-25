import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthPayload, UserWithAvatar, UserWithToken } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtHttpAuthGuard } from './guards/jwt-http-auth.guard';
import { Response } from 'express';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('refreshToken')
  async refreshToken() {
    return this.authService.refreshToken();
  }

  @Query('user')
  async getUser(): Promise<UserWithToken> | null {
    return this.authService.getUser();
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('users')
  async getAllUsers(): Promise<UserWithAvatar[]> {
    return this.authService.getAllUsers();
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserDto): Promise<AuthPayload> {
    return this.authService.createUser(input);
  }

  @Mutation('logInUser')
  async logInUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context('res') res: Response,
  ): Promise<AuthPayload> {
    return this.authService.logInUser(email, password, res);
  }

  @Mutation('logOutUser')
  async logOutUser(): Promise<boolean> {
    return this.authService.logOutUser();
  }
}
