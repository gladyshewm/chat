import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ChatWithoutMessages } from '../graphql';
import { FileUpload } from 'graphql-upload-ts';
import { CHAT_REPOSITORY, ChatRepository } from './chats.repository';
import { UsersService } from 'users/users.service';
import { ChatWithParticipantsData } from './models/chats.model';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    private usersService: UsersService,
    @Inject(CHAT_REPOSITORY) private chatRepository: ChatRepository,
  ) {}

  async isParticipant(chatId: string, userUuid: string): Promise<boolean> {
    return this.chatRepository.isParticipant(chatId, userUuid);
  }

  async createChat(
    userUuid: string,
    participantsIds: string[],
    name: string,
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

      return chat;
    } catch (error) {
      this.logger.error(`Ошибка при создании чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteChat(chatId: string, userUuid: string): Promise<boolean> {
    try {
      const chat = await this.chatRepository.getChatById(chatId);

      if (chat.is_group_chat) {
        return this.chatRepository.deleteGroupChat(chat.chat_id, userUuid);
      } else {
        return this.chatRepository.deleteOneOnOneChat(chat.chat_id, userUuid);
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

  async getChatInfoById(chatId: string): Promise<ChatWithoutMessages | null> {
    try {
      const chatData = await this.chatRepository.getChatById(chatId);

      if (!chatData) return null;

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

      if (!chatParticipants) return null;

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
      const buffer = await this.readFile(file);
      const uniqueFilename = this.generateUniqueFilename(file.filename);
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

      return publicURL;
    } catch (error) {
      this.logger.error(`Ошибка загрузки аватара: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async readFile(file: FileUpload): Promise<Buffer> {
    const { createReadStream } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  private generateUniqueFilename(filename: string): string {
    const fileExtension = filename.split('.').pop();
    return `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
  }

  async deleteChatAvatar(chatId: string): Promise<string | null> {
    try {
      const currentChat =
        await this.chatRepository.getCurrentChatAvatar(chatId);

      if (!currentChat?.avatar_url) {
        throw new HttpException('Аватар не найден', HttpStatus.NOT_FOUND);
      }

      const currentAvatarPath = currentChat.avatar_url
        .split('/')
        .slice(-3)
        .join('/');

      const hasAccess =
        await this.chatRepository.checkDeleteAccess(currentAvatarPath);

      if (!hasAccess) {
        throw new HttpException(
          'There are not enough rights to delete the avatar',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.chatRepository.removeAvatarFromStorage(currentAvatarPath);

      const files = await this.chatRepository.getChatAvatars(chatId);
      let newAvatarUrl: string | null = null;

      if (files && files.length > 0) {
        const lastFile = files.sort((a, b) =>
          String(b.created_at).localeCompare(String(a.created_at)),
        )[0];

        const publicUrlData = await this.chatRepository.getAvatarPublicUrl(
          chatId,
          lastFile.name,
        );

        newAvatarUrl = publicUrlData;
      }

      await this.chatRepository.updateGroupChatAvatar(chatId, newAvatarUrl);

      return newAvatarUrl;
    } catch (error) {
      this.logger.error(`Ошибка удаления аватара: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
