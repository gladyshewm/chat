import { Module } from '@nestjs/common';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { PubSubProvider } from 'common/pubsub/pubsub.provider';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [MessagesResolver, MessagesService, PubSubProvider],
})
export class MessagesModule {}
