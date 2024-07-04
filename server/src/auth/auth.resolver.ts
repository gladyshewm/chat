import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthPayload } from 'src/graphql';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserDto): Promise<AuthPayload> {
    return this.authService.createUser(input);
  }

  @Mutation('logInUser')
  async logInUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    return this.authService.logInUser(email, password);
  }

  @Mutation('logOutUser')
  async logOutUser(): Promise<boolean> {
    return this.authService.logOutUser();
  }
}
