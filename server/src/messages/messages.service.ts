import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PUB_SUB } from 'common/pubsub/pubsub.provider';
import { Message } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_REPOSITORY, MessageRepository } from './messages.repository';
import { ChatsService } from 'chats/chats.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private chatsService: ChatsService,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  async getChatMessages(
    chatId: string,
    userUuid: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Message[]> {
    try {
      const isParticipant = await this.chatsService.isParticipant(
        chatId,
        userUuid,
      );

      if (!isParticipant) {
        throw new HttpException(
          'Вы не являетесь участником чата',
          HttpStatus.FORBIDDEN,
        );
      }

      const messagesData = await this.messageRepository.getMessagesByChatId(
        chatId,
        limit,
        offset,
      );

      if (!messagesData) return [];

      const messages: Message[] = messagesData.map((message) => ({
        id: message.message_id,
        chatId: message.chat_id,
        userId: message.user_uuid,
        userName: message.profiles.name,
        avatarUrl: message.profiles.avatar_url,
        content: message.content,
        createdAt: message.created_at,
        isRead: message.is_read,
      }));

      return messages;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении сообщений чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findMessages(chatId: string, query: string): Promise<Message[]> {
    try {
      const messageData =
        await this.messageRepository.findMessagesByQueryString(chatId, query);

      const messages: Message[] = messageData.map((message) => ({
        id: message.message_id,
        chatId: message.chat_id,
        userId: message.user_uuid,
        userName: message.profiles.name,
        avatarUrl: message.profiles.avatar_url,
        content: message.content,
        createdAt: new Date(message.created_at),
        isRead: message.is_read,
      }));

      return messages;
    } catch (error) {
      this.logger.error(`Ошибка при поиске сообщений: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMessageSub(
    chatId: string,
    userUuid: string,
    content: string,
  ): Promise<Message> {
    try {
      const isParticipant = await this.chatsService.isParticipant(
        chatId,
        userUuid,
      );

      if (!isParticipant) {
        throw new HttpException(
          'Вы не являетесь участником чата',
          HttpStatus.FORBIDDEN,
        );
      }

      const newMessage = await this.messageRepository.sendMessage(
        chatId,
        userUuid,
        content,
      );

      const message = {
        id: newMessage.message_id,
        chatId: newMessage.chat_id,
        userId: newMessage.user_uuid,
        content: newMessage.content,
        createdAt: new Date(newMessage.created_at),
        isRead: newMessage.is_read,
        userName: newMessage.profiles.name,
        avatarUrl: newMessage.profiles.avatar_url,
      };

      this.pubSub.publish('messageSent', { messageSent: message });

      return message;
    } catch (error) {
      this.logger.error(`Ошибка при отправке сообщения: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
