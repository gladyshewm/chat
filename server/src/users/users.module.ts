import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { SupabaseUserRepository, USER_REPOSITORY } from './users.repository';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [forwardRef(() => AuthModule), FilesModule],
  providers: [
    UsersService,
    UsersResolver,
    {
      provide: USER_REPOSITORY,
      useClass: SupabaseUserRepository,
    },
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
