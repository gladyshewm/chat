import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatWithoutMessages, Message } from 'src/graphql';

@UseGuards(JWTAuthGuard)
@Resolver('Chats')
export class ChatsResolver {
  constructor(private chatsService: ChatsService) {}

  @Query('userChats')
  async getUserChats(
    @Context('user_uuid') userUuid: string,
  ): Promise<ChatWithoutMessages[]> {
    return this.chatsService.getUserChats(userUuid);
  }

  @Query('chatMessages')
  async getChatMessages(
    @Args('chatId') chatId: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<Message[]> {
    return this.chatsService.getChatMessages(chatId, limit, offset);
  }

  @Mutation('sendMessage')
  async sendMessage(
    @Args('chatId') chatId: string,
    @Args('content') content: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<Message> {
    return this.chatsService.sendMessage(chatId, content, userUuid);
  }
}
