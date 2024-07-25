import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtHttpAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtHttpAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const req = gqlContext.req;
    const res = gqlContext.res;

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        this.logger.error('No authorization header');
        throw new UnauthorizedException({ message: 'No authorization header' });
      }

      const [bearer, accessToken] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !accessToken) {
        this.logger.error('Invalid authorization header format');
        throw new UnauthorizedException({ message: 'User not authorized' });
      }

      try {
        const user = await this.jwtService.verifyAsync(accessToken);
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

        try {
          const {
            user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          } = await this.authService.refreshToken();

          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, //SET TO TRUE IN PRODUCTION
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          if (newAccessToken) {
            res.setHeader('X-Access-Token-Updated', 'true');
            res.setHeader('X-New-Access-Token', newAccessToken);
          }

          req.user = user;
          gqlContext['user_uuid'] = user.uuid;

          this.logger.log('Token refreshed successfully');
          return true;
        } catch (error) {
          this.logger.error(`Token refresh failed: ${error.message}`);
          throw new UnauthorizedException({
            message: 'User not authorized',
          });
        }
      }
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException({ message: 'User not authorized' });
    }
  }
}
