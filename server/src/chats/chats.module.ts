import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { PubSubProvider } from 'src/common/pubsub/pubsub.provider';

@Module({
  imports: [AuthModule],
  providers: [ChatsService, ChatsResolver, PubSubProvider],
})
export class ChatsModule {}
