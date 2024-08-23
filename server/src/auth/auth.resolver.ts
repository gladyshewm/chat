import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthPayload, UserWithToken } from '../graphql';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtHttpAuthGuard } from './guards/jwt-http-auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('refreshToken')
  async refreshToken(): Promise<AuthPayload> {
    return this.authService.refreshToken();
  }

  @Query('user')
  async getUser(@Context('req') req: Request): Promise<UserWithToken | null> {
    const token = req.accessToken;
    if (!token) {
      return null;
    }
    return this.authService.getUser(token);
  }

  @Mutation('createUser')
  async createUser(
    @Args('createInput') createInput: CreateUserDto,
  ): Promise<AuthPayload> {
    return this.authService.createUser(createInput);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('deleteUser')
  async deleteUser(@Context('user_uuid') uuid: string): Promise<boolean> {
    return this.authService.deleteUser(uuid);
  }

  @Mutation('logInUser')
  async logInUser(
    @Args('loginInput') loginData: LoginUserDto,
    @Context('res') res: Response,
  ): Promise<AuthPayload> {
    return this.authService.logInUser(loginData, res);
  }

  @Mutation('logOutUser')
  async logOutUser(): Promise<boolean> {
    return this.authService.logOutUser();
  }
}
