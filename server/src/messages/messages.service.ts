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
import { SupabaseService } from 'supabase/supabase.service';
import { MessageData } from './types/messages.types';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private supabaseService: SupabaseService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  async getChatMessages(
    chatId: string,
    userUuid: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Message[]> {
    try {
      const isParticipant = await this.isParticipant(chatId, userUuid);

      if (!isParticipant) {
        throw new HttpException(
          'Вы не являетесь участником чата',
          HttpStatus.FORBIDDEN,
        );
      }

      const { data: messagesData, error: messagesError } =
        (await this.supabaseService
          .getClient()
          .from('messages')
          .select(
            `
            message_id,
            chat_id,
            user_uuid,
            content,
            created_at,
            is_read,
            profiles:user_uuid (
              name,
              avatar_url
            )
          `,
          )
          .eq('chat_id', chatId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)) as unknown as {
          data: MessageData[];
          error: any;
        };

      if (messagesError) {
        this.logger.error(
          `Ошибка при получении сообщений чата: ${messagesError.message}`,
        );
        throw new HttpException(
          messagesError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!messagesData) return [];

      const messages = messagesData.map((message) => ({
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
      this.logger.error(
        `Ошибка при получении сообщений чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findMessages(chatId: string, query: string): Promise<Message[]> {
    try {
      const { data, error } = (await this.supabaseService
        .getClient()
        .from('messages')
        .select(
          `
          message_id,
          content,
          created_at,
          chat_id,
          user_uuid,
          is_read,
          profiles:user_uuid (
            name,
            avatar_url
          )
          `,
        )
        .eq('chat_id', chatId)
        .ilike('content', `%${query}%`)) as unknown as {
        data: MessageData[];
        error: any;
      };

      if (error) {
        this.logger.error(`Ошибка при поиске сообщений: ${error.message}`);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!data) return [];

      const messages: Message[] = data.map((message) => ({
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
      const isParticipant = await this.isParticipant(chatId, userUuid);

      if (!isParticipant) {
        throw new HttpException(
          'Вы не являетесь участником чата',
          HttpStatus.FORBIDDEN,
        );
      }

      const { data: newMessage, error } = (await this.supabaseService
        .getClient()
        .from('messages')
        .insert({
          message_id: Date.now().toString(),
          content: content,
          created_at: new Date(),
          chat_id: chatId,
          user_uuid: userUuid,
          is_read: false,
        })
        .select(
          `
          message_id,
          chat_id, 
          user_uuid,
          content, 
          created_at, 
          is_read,
          profiles:user_uuid (
            name,
            avatar_url
          )
          `,
        )
        .single()) as { data: MessageData; error: any };

      if (error) {
        this.logger.error(`Ошибка при отправке сообщения: ${error.message}`);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

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

  private async isParticipant(
    chatId: string,
    userUuid: string,
  ): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('party')
        .select('chat_id, user_uuid')
        .eq('chat_id', chatId);

      if (error) {
        this.logger.error(
          `Ошибка при проверке участника чата: ${error.message}`,
        );
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const isParticipant = data.find((item) => item.user_uuid === userUuid);

      return !!isParticipant;
    } catch (error) {
      this.logger.error(`Ошибка при проверке участника чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
