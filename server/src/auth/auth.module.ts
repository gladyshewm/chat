import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { AUTH_STRATEGY } from './strategies/auth-strategy.token';
import { AUTH_REPOSITORY, SupabaseAuthRepository } from './auth.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SUPABASE_JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    {
      provide: AUTH_STRATEGY,
      useClass: JwtAuthStrategy,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: SupabaseAuthRepository,
    },
  ],
  exports: [AuthService, JwtModule, AUTH_STRATEGY],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
