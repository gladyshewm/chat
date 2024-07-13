import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const req = gqlContext.req;

    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User not authorized' });
      }
      const user = await this.jwtService.verifyAsync(token).catch((err) => {
        throw new UnauthorizedException({ message: err.message });
      });
      req.user = user;
      gqlContext['user_uuid'] = user.sub;
    } catch (error) {
      throw new UnauthorizedException({ message: 'User not authorized' });
    }
    return true;
  }
}
