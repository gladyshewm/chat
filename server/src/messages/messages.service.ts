import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { FileUpload } from 'graphql-upload-ts';
import { MESSAGE_REPOSITORY, MessageRepository } from './messages.repository';
import { AttachedFile, Message } from '../generated_graphql';
import { AttachedFileInput } from './models/messages.model';
import { FilesService } from '../files/files.service';
import { ChatsService } from '../chats/chats.service';
import { PUB_SUB } from '../common/pubsub/pubsub.provider';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private chatsService: ChatsService,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(PUB_SUB) private pubSub: PubSub,
    private readonly filesService: FilesService,
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
        hasFiles: message.has_files,
        attachedFiles:
          message.attached_files?.map((file) => ({
            fileId: file.file_id,
            fileName: file.file_name,
            fileUrl: file.file_url,
          })) ?? [],
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
        hasFiles: message.has_files,
        attachedFiles:
          message.attached_files?.map((file) => ({
            fileId: file.file_id,
            fileName: file.file_name,
            fileUrl: file.file_url,
          })) ?? [],
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
    attachedFiles?: FileUpload[],
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
        !!attachedFiles,
      );

      const resolvedFiles = attachedFiles
        ? await Promise.all(attachedFiles)
        : [];

      const files = await this.processAttachedFiles(
        chatId,
        newMessage.message_id,
        resolvedFiles,
      );

      const message: Message = {
        id: newMessage.message_id,
        chatId: newMessage.chat_id,
        userId: newMessage.user_uuid,
        content: newMessage.content,
        createdAt: new Date(newMessage.created_at),
        isRead: newMessage.is_read,
        userName: newMessage.profiles.name,
        avatarUrl: newMessage.profiles.avatar_url,
        hasFiles: newMessage.has_files,
        attachedFiles: files,
      };

      this.pubSub.publish('messageSent', { messageSent: message });

      return message;
    } catch (error) {
      this.logger.error(`Ошибка при отправке сообщения: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async processAttachedFiles(
    chatId: string,
    messageId: string,
    files: FileUpload[],
  ): Promise<AttachedFile[]> {
    try {
      const uploadFilePromises = files.map(async (file) => {
        const buffer = await this.filesService.readFile(file);
        const uniqueFilename = this.filesService.generateUniqueFilename(
          file.filename,
        );
        const filePath = `chats/${chatId}/${uniqueFilename}`;

        await this.messageRepository.uploadFileToUserStorage(
          buffer,
          filePath,
          file.mimetype,
        );

        const fileUrl = await this.messageRepository.getFilePublicUrl(
          chatId,
          uniqueFilename,
        );

        const fileToInsert: AttachedFileInput = {
          file_name: uniqueFilename,
          file_path: filePath,
          buffer,
          mimetype: file.mimetype,
          file_url: fileUrl,
        };

        const attachedFile = await this.messageRepository.insertAttachedFile(
          messageId,
          fileToInsert,
        );

        return {
          fileId: attachedFile.file_id,
          fileName: attachedFile.file_name,
          fileUrl: attachedFile.file_url,
        };
      });

      return Promise.all(uploadFilePromises);
    } catch (error) {
      this.logger.error(
        `Ошибка при обработке вложенных файлов: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
