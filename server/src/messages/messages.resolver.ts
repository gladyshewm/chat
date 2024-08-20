import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from 'common/pubsub/pubsub.provider';
import { PubSub } from 'graphql-subscriptions';
import { JwtHttpAuthGuard } from 'auth/guards/jwt-http-auth.guard';
import { Message } from 'graphql';
import { JwtWsAuthGuard } from 'auth/guards/jwt-ws-auth.guard';

@Resolver('Messages')
export class MessagesResolver {
  constructor(
    private messagesService: MessagesService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @UseGuards(JwtHttpAuthGuard)
  @Query('chatMessages')
  async getChatMessages(
    @Args('chatId') chatId: string,
    @Context('user_uuid') userUuid: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<Message[]> {
    return this.messagesService.getChatMessages(
      chatId,
      userUuid,
      limit,
      offset,
    );
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('findMessages')
  async findMessages(
    @Args('chatId') chatId: string,
    @Args('query') query: string,
  ): Promise<Message[]> {
    return this.messagesService.findMessages(chatId, query);
  }

  //TODO: добавить удаление сообщений (у всех, только у себя)
  //TODO: добавить изменение сообщения

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('sendMessage')
  async sendMessage(
    @Args('chatId') chatId: string,
    @Args('content') content: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<Message> {
    return this.messagesService.sendMessageSub(chatId, userUuid, content);
  }

  @UseGuards(JwtWsAuthGuard)
  @Subscription('messageSent', {
    filter: (payload, variables) => {
      return payload.messageSent.chatId == variables.chatId;
    },
  })
  messageSent() {
    return this.pubSub.asyncIterator('messageSent');
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('sendTypingStatus')
  sendTypingStatus(
    @Args('chatId') chatId: string,
    @Args('userName') userName: string,
    @Args('isTyping') isTyping: boolean,
  ) {
    const feedback = { chatId, userName, isTyping };
    this.pubSub.publish('userTyping', { userTyping: feedback });
    return feedback;
  }

  @UseGuards(JwtWsAuthGuard)
  @Subscription('userTyping', {
    filter: (payload, variables) => {
      return payload.userTyping.chatId == variables.chatId;
    },
  })
  userTyping() {
    return this.pubSub.asyncIterator('userTyping');
  }
}
