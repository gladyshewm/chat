import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AttachedFileInput, MessageData } from './models/messages.model';
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
    attachedFiles?: AttachedFileInput[],
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
            attached_files (
              file_id,
              file_url,
              file_name
            ),
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
          attached_files (
            file_id,
            file_url,
            file_name
          ),
          profiles:user_uuid (
            name,
            avatar_url
          )
          `,
        )
        .eq('chat_id', chatId)
        .ilike('content', `%${query}%`)
        // .or(
        //   `content.ilike.%${query}%, attached_files.file_name.ilike.%${query}%`,
        // ) TODO: <-- этот or не работает из-за вложенности; добавить поиск по имени файла
        .order('created_at', { ascending: false })) as SupabaseResponse<
        MessageData[]
      >;

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
    attachedFiles?: AttachedFileInput[],
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

      if (attachedFiles && attachedFiles.length > 0) {
        const files = attachedFiles.map((file) => ({
          message_id: newMessage.message_id,
          file_url: file.file_url,
          file_name: file.file_name,
        }));

        const { error: fileError } = await this.supabaseService
          .getClient()
          .from('attached_files')
          .insert(files);

        if (fileError) {
          throw new HttpException(
            'Не удалось добавить вложенные файлы',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      const fullMessageResponse = (await this.supabaseService
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
          attached_files (
            file_id,
            file_url,
            file_name
          ),
          profiles:user_uuid (
            name,
            avatar_url
          )
        `,
        )
        .eq('message_id', newMessage.message_id)
        .single()) as SupabaseResponse<MessageData>;

      const fullMessage =
        this.supabaseService.handleSupabaseResponse(fullMessageResponse);

      if (!fullMessage) {
        throw new HttpException(
          'Не удалось получить полную информацию о новом сообщении',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return fullMessage;
    } catch (error) {
      this.logger.error(`Ошибка при отправке сообщения: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
