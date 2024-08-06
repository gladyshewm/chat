import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { AuthModule } from '../auth/auth.module';
import { PubSubProvider } from '../common/pubsub/pubsub.provider';

@Module({
  imports: [AuthModule],
  providers: [ChatsService, ChatsResolver, PubSubProvider],
})
export class ChatsModule {}
