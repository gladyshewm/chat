import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { AuthModule } from '../auth/auth.module';
import { PubSubProvider } from '../common/pubsub/pubsub.provider';
import { CHAT_REPOSITORY, SupabaseChatRepository } from './chats.repository';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [AuthModule, UsersModule, FilesModule],
  providers: [
    ChatsService,
    ChatsResolver,
    PubSubProvider,
    {
      provide: CHAT_REPOSITORY,
      useClass: SupabaseChatRepository,
    },
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
