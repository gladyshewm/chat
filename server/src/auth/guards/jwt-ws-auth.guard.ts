import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtWsAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const req = gqlContext.req;
    /*  console.log(ctx.getType());
    const { connectionParams } = ctx.getContext().req; */

    try {
      const { connectionParams } = req;

      if (!connectionParams || !connectionParams.authorization) {
        this.logger.error(`Authorization header is missing`);
        throw new WsException('Authorization header is missing');
      }

      const authHeader = connectionParams.authorization;
      const [bearer, accessToken] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !accessToken) {
        this.logger.error(`Invalid authorization header format`);
        throw new WsException({
          message: 'Invalid authorization header format',
        });
      }

      try {
        const user = await this.jwtService.verifyAsync(accessToken);
        ctx.getContext().user = user;
        ctx.getContext()['user_uuid'] = user.sub;

        return true;
      } catch (error) {
        this.logger.warn(`JWT verification failed: ${error.message}`);
        const { accessToken: newAccessToken, user } =
          await this.authService.refreshToken();
        ctx.getContext().user = user;
        ctx.getContext()['user_uuid'] = user.uuid;
        ctx.getContext().req.connectionParams.authorization = `Bearer ${newAccessToken}`;

        return true;
      }
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new WsException({ message: 'User not authorized' });
    }
  }
}
