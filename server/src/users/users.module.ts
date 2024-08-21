import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { SupabaseUserRepository, USER_REPOSITORY } from './users.repository';

@Module({
  imports: [AuthModule],
  providers: [
    UsersService,
    UsersResolver,
    {
      provide: USER_REPOSITORY,
      useClass: SupabaseUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
