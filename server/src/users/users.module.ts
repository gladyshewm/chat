import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
