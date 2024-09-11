import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import {
  MESSAGE_REPOSITORY,
  SupabaseMessageRepository,
} from './messages.repository';
import { AuthModule } from '../auth/auth.module';
import { PubSubProvider } from '../common/pubsub/pubsub.provider';
import { ChatsModule } from '../chats/chats.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [AuthModule, ChatsModule, FilesModule],
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
