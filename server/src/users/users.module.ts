import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [AuthModule],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
