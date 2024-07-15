import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtWsAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { connectionParams } = ctx.getContext().req;

    try {
      if (!connectionParams || !connectionParams.authorization) {
        throw new WsException('Authorization header is missing');
      }

      const authHeader = connectionParams.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        this.logger.error(`Invalid authorization header format`);
        throw new WsException({
          message: 'Invalid authorization header format',
        });
      }

      const user = await this.jwtService.verifyAsync(token).catch((err) => {
        this.logger.error(`JWT verification failed: ${err.message}`);
        throw new WsException({ message: err.message });
      });

      ctx.getContext().user = user;
      ctx.getContext()['user_uuid'] = user.sub;

      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new WsException({ message: 'User not authorized' });
    }
  }
}
