import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { PubSubProvider } from 'common/pubsub/pubsub.provider';
import { AuthModule } from 'auth/auth.module';
import {
  MESSAGE_REPOSITORY,
  SupabaseMessageRepository,
} from './messages.repository';
import { ChatsModule } from 'chats/chats.module';

@Module({
  imports: [AuthModule, ChatsModule],
  providers: [
    MessagesResolver,
    MessagesService,
    PubSubProvider,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: SupabaseMessageRepository,
    },
  ],
})
export class MessagesModule {}
