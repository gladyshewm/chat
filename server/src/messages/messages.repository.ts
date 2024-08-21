import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MessageData } from './models/messages.model';
import { SupabaseResponse, SupabaseService } from 'supabase/supabase.service';

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';

export interface MessageRepository {
  getMessagesByChatId(
    chatId: string,
    limit: number,
    offset: number,
  ): Promise<MessageData[]>;
  findMessagesByQueryString(
    chatId: string,
    query: string,
  ): Promise<MessageData[]>;
  sendMessage(
    chatId: string,
    userUuid: string,
    content: string,
  ): Promise<MessageData>;
}

@Injectable()
export class SupabaseMessageRepository implements MessageRepository {
  private readonly logger = new Logger(SupabaseMessageRepository.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getMessagesByChatId(
    chatId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<MessageData[]> {
    try {
      const response = (await this.supabaseService
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
        .range(offset, offset + limit - 1)) as SupabaseResponse<MessageData[]>;

      return this.supabaseService.handleSupabaseResponse(response) || [];
    } catch (error) {
      this.logger.error(
        `Ошибка при получении сообщений чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findMessagesByQueryString(
    chatId: string,
    query: string,
  ): Promise<MessageData[]> {
    try {
      const response = (await this.supabaseService
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
        .ilike('content', `%${query}%`)) as SupabaseResponse<MessageData[]>;

      return this.supabaseService.handleSupabaseResponse(response) || [];
    } catch (error) {
      this.logger.error(`Ошибка при поиске сообщений: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMessage(
    chatId: string,
    userUuid: string,
    content: string,
  ): Promise<MessageData> {
    try {
      const response = (await this.supabaseService
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
        .single()) as SupabaseResponse<MessageData>;

      const newMessage = this.supabaseService.handleSupabaseResponse(response);

      if (!newMessage) {
        throw new HttpException(
          'Не удалось получить данные о новом сообщении',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newMessage;
    } catch (error) {
      this.logger.error(`Ошибка при отправке сообщения: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
