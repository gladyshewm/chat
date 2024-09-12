import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  AttachedFile,
  AttachedFileInput,
  MessageData,
} from './models/messages.model';
import {
  SupabaseResponse,
  SupabaseService,
} from '../supabase/supabase.service';

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
    hasFiles: boolean,
  ): Promise<MessageData>;
  uploadFileToUserStorage(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
  ): Promise<void>;
  getFilePublicUrl(chatId: string, filename: string): Promise<string>;
  insertAttachedFile(
    messageId: string,
    attachedFile: AttachedFileInput,
  ): Promise<AttachedFile>;
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
            has_files,
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
          has_files,
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
    content: string | null = null,
    hasFiles: boolean = false,
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
          has_files: hasFiles,
        })
        .select(
          `
          message_id,
          chat_id, 
          user_uuid,
          content, 
          created_at, 
          is_read,
          has_files,
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

  async uploadFileToUserStorage(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .storage.from('messages')
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error('Ошибка загрузки файла:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFilePublicUrl(chatId: string, filename: string): Promise<string> {
    try {
      const { data } = await this.supabaseService
        .getClient()
        .storage.from('messages')
        .getPublicUrl(`chats/${chatId}/${filename}`);

      return data.publicUrl;
    } catch (error) {
      this.logger.error(
        'Ошибка получения публичного URL для аватара пользователя:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async insertAttachedFile(
    messageId: string,
    attachedFile: AttachedFileInput,
  ): Promise<AttachedFile> {
    try {
      if (!attachedFile) {
        this.logger.error('Не переданы вложенные файлы');
        throw new HttpException(
          'Не переданы вложенные файлы',
          HttpStatus.BAD_REQUEST,
        );
      }

      const file = {
        message_id: messageId,
        file_url: attachedFile.file_url,
        file_name: attachedFile.file_name,
      };

      const response = (await this.supabaseService
        .getClient()
        .from('attached_files')
        .insert(file)
        .select('*')
        .single()) as SupabaseResponse<AttachedFile>;

      const attached_files =
        this.supabaseService.handleSupabaseResponse(response);

      if (!attached_files) {
        throw new HttpException(
          'Не удалось добавить вложенные файлы',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return attached_files;
    } catch (error) {
      this.logger.error(
        'Ошибка при добавлении вложенных файлов:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
