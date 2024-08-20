import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Inject, UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ChatWithoutMessages, Message } from '../graphql';
import { PUB_SUB } from '../common/pubsub/pubsub.provider';
import { PubSub } from 'graphql-subscriptions';
import { JwtHttpAuthGuard } from '../auth/guards/jwt-http-auth.guard';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';

@Resolver('Chats')
export class ChatsResolver {
  constructor(
    private chatsService: ChatsService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('createChat')
  async createChat(
    @Args('participantsIds') participantsIds: string[],
    @Args('name') name: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<ChatWithoutMessages> {
    return this.chatsService.createChat(userUuid, participantsIds, name);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('deleteChat')
  async deleteChat(
    @Args('chatId') chatId: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<boolean> {
    return this.chatsService.deleteChat(chatId, userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('userChats')
  async getUserChats(
    @Context('user_uuid') userUuid: string,
  ): Promise<ChatWithoutMessages[]> {
    return this.chatsService.getUserChats(userUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('chatWithUser')
  async getChatWithUser(
    @Args('userUuid') withUser: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<ChatWithoutMessages | null> {
    return this.chatsService.getChatWithUser(userUuid, withUser);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('chatById')
  async getChatInfoById(
    @Args('chatId') chatId: string,
  ): Promise<ChatWithoutMessages | null> {
    return this.chatsService.getChatInfoById(chatId);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('chatMessages')
  async getChatMessages(
    @Args('chatId') chatId: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<Message[]> {
    return this.chatsService.getChatMessages(chatId, limit, offset);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('sendMessage')
  async sendMessage(
    @Args('chatId') chatId: string,
    @Args('content') content: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<Message> {
    return this.chatsService.sendMessageSub(chatId, userUuid, content);
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
  @Query('findMessages')
  async findMessages(
    @Args('chatId') chatId: string,
    @Args('query') query: string,
  ): Promise<Message[]> {
    return this.chatsService.findMessages(chatId, query);
  }

  //TODO: добавить удаление сообщений (у всех, только у себя)
  //TODO: добавить изменение сообщения

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

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('uploadChatAvatar')
  async uploadChatAvatar(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Args('chatId') chatId: string,
  ): Promise<string> {
    return this.chatsService.uploadChatAvatar(image, chatId);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('updateChatAvatar')
  async updateChatAvatar(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Args('chatId') chatId: string,
  ): Promise<string | null> {
    return this.chatsService.updateChatAvatar(image, chatId);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('deleteChatAvatar')
  async deleteChatAvatar(
    @Args('chatId') chatId: string,
  ): Promise<string | null> {
    return this.chatsService.deleteChatAvatar(chatId);
  }
}
