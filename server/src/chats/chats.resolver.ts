import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ChatsService } from './chats.service';
import { JwtHttpAuthGuard } from '../auth/guards/jwt-http-auth.guard';
import { AvatarInfo, ChatWithoutMessages } from '../generated_graphql';

@Resolver('Chats')
export class ChatsResolver {
  constructor(
    private chatsService: ChatsService,
    // @Inject(PUB_SUB) private pubSub: PubSub,
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
  @Query('chatAllAvatars')
  async getChatAllAvatars(
    @Args('chatId') chatId: string,
  ): Promise<AvatarInfo[]> {
    return this.chatsService.getChatAllAvatars(chatId);
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
}
