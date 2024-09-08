import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';
import { AUTH_STRATEGY } from '../strategies/auth-strategy.token';
import { AuthStrategy } from '../strategies/auth.strategy.interface';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtWsAuthGuard.name);

  constructor(@Inject(AUTH_STRATEGY) private authStrategy: AuthStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    let connectionParams;

    if (gqlContext.req) {
      connectionParams = gqlContext.req.connectionParams;
    } else {
      connectionParams = gqlContext.connectionParams;
    }

    if (!connectionParams) {
      this.logger.error('Connection params not found');
      throw new WsException({ message: 'Connection params not found' });
    }

    try {
      const accessToken = this.extractTokenFromHeader(connectionParams);

      if (!accessToken) {
        this.logger.error('Access token not found');
        throw new WsException({ message: 'Access token not found' });
      }

      try {
        const user = await this.authStrategy.validateToken(accessToken);
        gqlContext.user = user;
        gqlContext['user_uuid'] = user.sub;

        return true;
      } catch (error) {
        this.logger.warn(`JWT verification failed: ${error.message}`);
        await this.refreshToken(gqlContext);

        return true;
      }
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new WsException({ message: 'User not authorized' });
    }
  }

  private extractTokenFromHeader(connectionParams: any): string | undefined {
    if (!connectionParams || !connectionParams.Authorization) {
      this.logger.error(`Authorization header is missing`);
      throw new WsException('Authorization header is missing');
    }

    const authHeader = connectionParams.Authorization;
    const [bearer, accessToken] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !accessToken) {
      this.logger.error(`Invalid authorization header format`);
      throw new WsException({
        message: 'Invalid authorization header format',
      });
    }

    return accessToken;
  }

  private async refreshToken(context: any) {
    try {
      const { user, accessToken: newAccessToken } =
        await this.authStrategy.refreshToken();

      context.user = user;
      context['user_uuid'] = user.uuid;
      context.connectionParams.Authorization = `Bearer ${newAccessToken}`;

      this.logger.log('Token refreshed successfully');
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new WsException({
        message: 'User not authorized',
      });
    }
  }
}
