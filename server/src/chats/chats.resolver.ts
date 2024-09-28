import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ChatsService } from './chats.service';
import { JwtHttpAuthGuard } from '../auth/guards/jwt-http-auth.guard';
import { AvatarInfo, ChatWithoutMessages } from '../generated_graphql';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { PUB_SUB } from '../common/pubsub/pubsub.provider';
import { PubSub } from 'graphql-subscriptions';

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
    @Args('avatar', { type: () => GraphQLUpload }) avatar: FileUpload,
    @Context('user_uuid') userUuid: string,
  ): Promise<ChatWithoutMessages> {
    return this.chatsService.createChat(
      userUuid,
      participantsIds,
      name,
      avatar,
    );
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

  @UseGuards(JwtWsAuthGuard)
  @Subscription('userChats')
  getUserChatsSub() {
    return this.pubSub.asyncIterator('userChats');
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
  @Query('chatAllAvatars')
  async getChatAllAvatars(
    @Args('chatId') chatId: string,
  ): Promise<AvatarInfo[]> {
    return this.chatsService.getChatAllAvatars(chatId);
  }

  @UseGuards(JwtWsAuthGuard)
  @Subscription('chatById', {
    filter: (payload, variables) => payload.chatById.id == variables.chatId,
  })
  getChatInfoByIdSub() {
    return this.pubSub.asyncIterator('chatById');
  }

  @UseGuards(JwtHttpAuthGuard)
  @Query('chatById')
  async getChatInfoById(
    @Args('chatId') chatId: string,
  ): Promise<ChatWithoutMessages | null> {
    return this.chatsService.getChatInfoById(chatId);
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
  @Mutation('deleteChatAvatar')
  async deleteChatAvatar(
    @Args('chatId') chatId: string,
    @Args('avatarUrl') avatarUrl: string,
  ): Promise<string | null> {
    return this.chatsService.deleteChatAvatar(chatId, avatarUrl);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('addUserToChat')
  async addUserToChat(
    @Args('chatId') chatId: string,
    @Args('userUuid') userUuid: string,
    @Context('user_uuid') currentUserUuid: string,
  ): Promise<ChatWithoutMessages> {
    return this.chatsService.addUserToChat(chatId, userUuid, currentUserUuid);
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('removeUserFromChat')
  async removeUserFromChat(
    @Args('chatId') chatId: string,
    @Args('userUuid') userUuid: string,
    @Context('user_uuid') currentUserUuid: string,
  ): Promise<ChatWithoutMessages> {
    return this.chatsService.removeUserFromChat(
      chatId,
      userUuid,
      currentUserUuid,
    );
  }

  @UseGuards(JwtHttpAuthGuard)
  @Mutation('changeChatName')
  async changeChatName(
    @Args('chatId') chatId: string,
    @Args('newName') newName: string,
    @Context('user_uuid') userUuid: string,
  ): Promise<ChatWithoutMessages> {
    return this.chatsService.changeChatName(chatId, newName, userUuid);
  }
}
