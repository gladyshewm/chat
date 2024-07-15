import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtHttpAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtHttpAuthGuard.name);

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
        this.logger.error('Invalid authorization header format');
        throw new UnauthorizedException({ message: 'User not authorized' });
      }

      const user = await this.jwtService.verifyAsync(token).catch((err) => {
        this.logger.error(`JWT verification failed: ${err.message}`);
        throw new UnauthorizedException({ message: err.message });
      });
      req.user = user;
      gqlContext['user_uuid'] = user.sub;

      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException({ message: 'User not authorized' });
    }
  }
}
