import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { CHAT_REPOSITORY, ChatRepository } from './chats.repository';
import { ChatWithParticipantsData } from './models/chats.model';
import { AvatarInfo, ChatWithoutMessages } from '../generated_graphql';
import { FilesService } from '../files/files.service';
import { UsersService } from '../users/users.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../common/pubsub/pubsub.provider';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    private usersService: UsersService,
    private readonly filesService: FilesService,
    @Inject(CHAT_REPOSITORY) private chatRepository: ChatRepository,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  async isParticipant(chatId: string, userUuid: string): Promise<boolean> {
    return this.chatRepository.isParticipant(chatId, userUuid);
  }

  async createChat(
    userUuid: string,
    participantsIds: string[],
    name: string,
    avatar?: FileUpload,
  ): Promise<ChatWithoutMessages> {
    participantsIds.push(userUuid);

    try {
      const chatData = await this.chatRepository.createSingleChat(
        userUuid,
        participantsIds,
        name,
      );

      const chat: ChatWithoutMessages = {
        id: chatData.chat_id,
        userUuid: chatData.user_uuid,
        name: chatData.name,
        isGroupChat: chatData.is_group_chat,
        createdAt: chatData.created_at,
        groupAvatarUrl: null,
        participants: [],
      };

      if (chat.isGroupChat) await this.chatRepository.createGroupChat(chat.id);

      for (let i = 0; i < participantsIds.length; i++) {
        const participant = participantsIds[i];
        const participantData = await this.usersService.getUser(participant);

        chat.participants.push({
          id: participantData.uuid,
          name: participantData.name,
          avatarUrl: participantData.avatar_url,
        });
      }

      await this.chatRepository.createParty(chat.id, participantsIds);

      if (avatar) {
        const avatarUrl = await this.uploadChatAvatar(avatar, chat.id);
        chat.groupAvatarUrl = avatarUrl;
      }

      const updatedChats = await this.getUserChats(userUuid);

      if (!updatedChats.some((updChat) => updChat.id === chat.id)) {
        updatedChats.push(chat);
      }

      await this.pubSub.publish('userChats', {
        userChats: updatedChats,
      });

      return chat;
    } catch (error) {
      this.logger.error(`Ошибка при создании чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO: тут в идеале транзакция
  async deleteChat(chatId: string, userUuid: string): Promise<boolean> {
    try {
      const chat = await this.chatRepository.getChatById(chatId);

      if (chat.is_group_chat) {
        const avatars = await this.getChatAllAvatars(chatId);

        if (avatars && avatars.length > 0) {
          await Promise.all(
            avatars.map(async (file) => {
              const isRemoved =
                await this.chatRepository.removeAvatarFromStorage(
                  `chats/${chatId}/${file.name}`,
                );

              if (!isRemoved) {
                throw new Error(
                  `Не удалось удалить аватар из хранилища: ${file.name}`,
                );
              }
            }),
          );
        }

        const isDeleted = this.chatRepository.deleteGroupChat(
          chat.chat_id,
          userUuid,
        );

        let updatedChats = await this.getUserChats(userUuid);
        updatedChats = updatedChats.filter(
          (updChat) => String(updChat.id) !== chatId,
        );
        await this.pubSub.publish('userChats', { userChats: updatedChats });

        return isDeleted;
      } else {
        const isDeleted = await this.chatRepository.deleteOneOnOneChat(
          chat.chat_id,
          userUuid,
        );

        let updatedChats = await this.getUserChats(userUuid);
        updatedChats = updatedChats.filter(
          (updChat) => String(updChat.id) !== chatId,
        );
        await this.pubSub.publish('userChats', { userChats: updatedChats });

        return isDeleted;
      }
    } catch (error) {
      this.logger.error(`Ошибка при удалении чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserChats(userUuid: string): Promise<ChatWithoutMessages[]> {
    try {
      const chats = await this.chatRepository.getChatsByUserId(userUuid);

      return this.buildChatResponse(chats);
    } catch (error) {
      this.logger.error(
        `Ошибка при получении чатов пользователя: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private buildChatResponse(
    chatsData: ChatWithParticipantsData[],
  ): ChatWithoutMessages[] {
    const chatMap = new Map<string, ChatWithoutMessages>();

    chatsData.forEach((item) => {
      const { chat, profiles } = item;
      if (!chatMap.has(chat.chat_id)) {
        chatMap.set(chat.chat_id, {
          id: chat.chat_id,
          userUuid: chat.user_uuid,
          name: chat.name,
          isGroupChat: chat.is_group_chat,
          groupAvatarUrl: chat.is_group_chat
            ? chat.group_chat.avatar_url || null
            : null,
          participants: [],
          createdAt: chat.created_at,
        });
      }

      const chatEntry = chatMap.get(chat.chat_id)!;

      if (!chatEntry.participants.some((p) => p.id === profiles.uuid)) {
        chatEntry.participants.push({
          id: profiles.uuid,
          name: profiles.name,
          avatarUrl: profiles.avatar_url || null,
        });
      }
    });

    return Array.from(chatMap.values());
  }

  async getChatWithUser(
    userUuid: string,
    otherUserId: string,
  ): Promise<ChatWithoutMessages | null> {
    try {
      const userChats = await this.getUserChats(userUuid);

      const existingChat = userChats.find(
        (chat) =>
          !chat.isGroupChat &&
          chat.participants.some(
            (participant) => participant.id === otherUserId,
          ),
      );

      return existingChat || null;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении чата с пользователем: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChatAllAvatars(chatId: string): Promise<AvatarInfo[]> {
    try {
      const res = await this.chatRepository.getChatAvatars(chatId);

      const avatars = await Promise.all(
        res.map(async (avatar) => ({
          url: await this.chatRepository.getAvatarPublicUrl(
            chatId,
            avatar.name,
          ),
          name: avatar.name,
          createdAt: new Date(avatar.created_at),
        })),
      );

      return avatars;
    } catch (error) {
      this.logger.error(`Ошибка при получении аватаров чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChatInfoById(chatId: string): Promise<ChatWithoutMessages> {
    try {
      const chatData = await this.chatRepository.getChatById(chatId);

      const chat: ChatWithoutMessages = {
        id: chatData.chat_id,
        name: chatData.name,
        userUuid: chatData.user_uuid,
        isGroupChat: chatData.is_group_chat,
        groupAvatarUrl: null,
        participants: [],
        createdAt: chatData.created_at,
      };

      const chatParticipants =
        await this.chatRepository.getPartyByChatId(chatId);

      chat.participants = chatParticipants.map((item) => ({
        id: item.profiles.uuid,
        name: item.profiles.name,
        avatarUrl: item.profiles.avatar_url,
      }));

      if (chat.isGroupChat) {
        const groupAvatar =
          await this.chatRepository.getGroupChatAvatar(chatId);

        chat.groupAvatarUrl = groupAvatar.avatar_url;
      }

      return chat;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении информации о чате: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadChatAvatar(file: FileUpload, chatId: string): Promise<string> {
    try {
      const buffer = await this.filesService.readFile(file);
      const uniqueFilename = this.filesService.generateUniqueFilename(
        file.filename,
      );
      const filePath = `chats/${chatId}/${uniqueFilename}`;

      await this.chatRepository.uploadAvatarToChatStorage(
        buffer,
        filePath,
        file.mimetype,
      );

      const publicURL = await this.chatRepository.getAvatarPublicUrl(
        chatId,
        uniqueFilename,
      );

      await this.chatRepository.updateGroupChatAvatar(chatId, publicURL);

      const updatedChat = await this.getChatInfoById(chatId);

      this.pubSub.publish('chatById', {
        chatById: updatedChat,
      });

      return publicURL;
    } catch (error) {
      this.logger.error(`Ошибка загрузки аватара: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteChatAvatar(
    chatId: string,
    avatarUrl: string,
  ): Promise<string | null> {
    try {
      const currentChat =
        await this.chatRepository.getCurrentChatAvatar(chatId);

      const avatarPathToDelete = avatarUrl.split('/').slice(-3).join('/');

      const hasAccess =
        await this.chatRepository.checkDeleteAccess(avatarPathToDelete);

      if (!hasAccess) {
        throw new HttpException(
          'There are not enough rights to delete the avatar',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.chatRepository.removeAvatarFromStorage(avatarPathToDelete);

      const isActiveAvatar = currentChat.avatar_url === avatarUrl;
      if (!isActiveAvatar) return currentChat.avatar_url;

      const files = await this.chatRepository.getChatAvatars(chatId);
      let newAvatarUrl: string | null = null;

      if (files && files.length > 0) {
        const lastFile = files[0];
        const publicUrlData = await this.chatRepository.getAvatarPublicUrl(
          chatId,
          lastFile.name,
        );

        newAvatarUrl = publicUrlData;
      }

      await this.chatRepository.updateGroupChatAvatar(chatId, newAvatarUrl);

      const updatedChat = await this.getChatInfoById(chatId);

      this.pubSub.publish('chatById', {
        chatById: updatedChat,
      });

      return newAvatarUrl;
    } catch (error) {
      this.logger.error(`Ошибка удаления аватара: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addUserToChat(
    chatId: string,
    userUuid: string,
    currentUserUuid: string,
  ): Promise<ChatWithoutMessages> {
    try {
      const chat = await this.chatRepository.getChatById(chatId);

      if (chat.user_uuid !== currentUserUuid) {
        throw new HttpException(
          'Only the chat creator can add new participants',
          HttpStatus.FORBIDDEN,
        );
      }

      const isParticipant = await this.chatRepository.isParticipant(
        chatId,
        userUuid,
      );

      if (isParticipant) {
        this.logger.warn('Пользователь уже является участником чата');
        return this.getChatInfoById(chatId);
      }

      await this.chatRepository.addUserToChat(chatId, userUuid);

      const updatedChat = await this.getChatInfoById(chatId);

      this.pubSub.publish('chatById', {
        chatById: updatedChat,
      });

      return updatedChat;
    } catch (error) {
      this.logger.error(
        `Ошибка при добавлении пользователя в чат: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeUserFromChat(
    chatId: string,
    userUuid: string,
    currentUserUuid: string,
  ): Promise<ChatWithoutMessages> {
    try {
      const chat = await this.chatRepository.getChatById(chatId);

      if (chat.user_uuid !== currentUserUuid) {
        throw new HttpException(
          'Only the chat creator can remove participants',
          HttpStatus.FORBIDDEN,
        );
      }

      const isParticipant = await this.chatRepository.isParticipant(
        chatId,
        userUuid,
      );

      if (!isParticipant) {
        this.logger.warn('Пользователь не является участником чата');
        return this.getChatInfoById(chatId);
      }

      if (userUuid === chat.user_uuid) {
        throw new HttpException(
          'Cannot remove the chat creator from the chat',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.chatRepository.removeUserFromChat(chatId, userUuid);

      const updatedChat = await this.getChatInfoById(chatId);

      this.pubSub.publish('chatById', {
        chatById: updatedChat,
      });

      return updatedChat;
    } catch (error) {
      this.logger.error(
        `Ошибка при удалении пользователя из чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeChatName(
    chatId: string,
    newName: string,
    userUuid: string,
  ): Promise<ChatWithoutMessages> {
    try {
      const chat = await this.chatRepository.getChatById(chatId);

      if (chat.user_uuid !== userUuid) {
        throw new HttpException(
          'Only the chat creator can change the chat name',
          HttpStatus.FORBIDDEN,
        );
      }

      const updatedChat = await this.chatRepository.updateChatName(
        chatId,
        newName,
      );

      const newChat: ChatWithoutMessages = {
        id: updatedChat.chat.chat_id,
        name: updatedChat.chat.name,
        userUuid: updatedChat.chat.user_uuid,
        isGroupChat: updatedChat.chat.is_group_chat,
        groupAvatarUrl: updatedChat.chat.group_chat.avatar_url,
        participants: updatedChat.profiles.map((profile) => ({
          id: profile.uuid,
          name: profile.name,
          avatarUrl: profile.avatar_url,
        })),
        createdAt: updatedChat.chat.created_at,
      };

      await this.pubSub.publish('chatById', {
        chatById: newChat,
      });

      const updatedChats = await this.getUserChats(userUuid);

      if (!updatedChats.some((updChat) => updChat.id === newChat.id)) {
        updatedChats.push(newChat);
      }

      await this.pubSub.publish('userChats', {
        userChats: updatedChats,
      });

      return newChat;
    } catch (error) {
      this.logger.error(`Ошибка при изменении имени чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
