import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthStrategy } from 'auth/strategies/auth.strategy.interface';
import { AUTH_STRATEGY } from 'auth/strategies/auth-strategy.token';

@Injectable()
export class JwtHttpAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtHttpAuthGuard.name);

  constructor(@Inject(AUTH_STRATEGY) private authStrategy: AuthStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const req = gqlContext.req;
    const res = gqlContext.res;

    try {
      const accessToken = this.extractTokenFromHeader(req);
      if (!accessToken) {
        this.logger.error('Access token not found');
        throw new UnauthorizedException({ message: 'Access token not found' });
      }

      try {
        const user = await this.authStrategy.validateToken(accessToken);
        req.user = user;
        gqlContext['user_uuid'] = user.sub;

        return true;
      } catch (error) {
        this.logger.warn(`JWT verification failed: ${error.message}`);

        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
          this.logger.error('Refresh token not found');
          throw new UnauthorizedException({ message: 'User not authorized' });
        }

        await this.refreshToken(req, res, gqlContext);

        return true;
      }
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException({ message: 'User not authorized' });
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async refreshToken(request: any, response: any, context: any) {
    try {
      const {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = await this.authStrategy.refreshToken();

      this.authStrategy.setRefreshTokenCookie(response, newRefreshToken);

      if (newAccessToken) {
        response.setHeader('X-Access-Token-Updated', 'true');
        response.setHeader('X-New-Access-Token', newAccessToken);
      } else {
        response.setHeader('X-Access-Token-Updated', 'false');
      }

      request.user = user;
      context['user_uuid'] = user.uuid;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'User not authorized',
      });
    }
  }
}
