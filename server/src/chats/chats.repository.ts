import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FileObject } from '@supabase/storage-js';
import {
  SupabaseResponse,
  SupabaseService,
} from '../supabase/supabase.service';
import {
  ChatData,
  ChatWithParticipantsData,
  GroupAvatarData,
  PartyItem,
} from './models/chats.model';

export const CHAT_REPOSITORY = 'CHAT_REPOSITORY';

export interface ChatRepository {
  // Chats
  isParticipant(chatId: string, userUuid: string): Promise<boolean>;
  getChatById(chatId: string): Promise<ChatData>;
  getChatsByUserId(userUuid: string): Promise<ChatWithParticipantsData[]>;
  getPartyByChatId(chatId: string): Promise<PartyItem[]>;
  getGroupChatAvatar(chatId: string): Promise<GroupAvatarData>;
  createSingleChat(
    userUuid: string,
    participantsIds: string[],
    name: string,
  ): Promise<ChatData>;
  createGroupChat(chatId: string): Promise<boolean>;
  createParty(chatId: string, participantsIds: string[]): Promise<void>;
  deleteOneOnOneChat(chatId: string, userUuid: string): Promise<boolean>;
  deleteGroupChat(chatId: string, userUuid: string): Promise<boolean>;
  // Avatars
  uploadAvatarToChatStorage(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
  ): Promise<void>;
  getAvatarPublicUrl(chatId: string, fileName: string): Promise<string>;
  updateGroupChatAvatar(
    chatId: string,
    publicURL: string | null,
  ): Promise<void>;
  getCurrentChatAvatar(chatId: string): Promise<{ avatar_url: string }>;
  checkDeleteAccess(file_path: string): Promise<boolean>;
  removeAvatarFromStorage(avatarPath: string): Promise<void>;
  getChatAvatars(chatId: string): Promise<FileObject[]>;
}

@Injectable()
export class SupabaseChatRepository implements ChatRepository {
  private readonly logger = new Logger(SupabaseChatRepository.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async isParticipant(chatId: string, userUuid: string): Promise<boolean> {
    const response = (await this.supabaseService
      .getClient()
      .from('party')
      .select('chat_id, user_uuid')
      .eq('chat_id', chatId)) as SupabaseResponse<
      {
        chat_id: string;
        user_uuid: string;
      }[]
    >;

    const responseData = this.supabaseService.handleSupabaseResponse(response);

    if (!responseData) {
      this.logger.warn(`Чат не найден`);
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }

    const isParticipant = responseData.find(
      (item) => item.user_uuid === userUuid,
    );

    return !!isParticipant;
  }

  async getChatById(chatId: string): Promise<ChatData> {
    const response = (await this.supabaseService
      .getClient()
      .from('chat')
      .select(
        `
        chat_id,
        user_uuid,
        name,
        is_group_chat,
        created_at
        `,
      )
      .eq('chat_id', chatId)
      .single()) as SupabaseResponse<ChatData>;

    const chat =
      this.supabaseService.handleSupabaseResponse<ChatData>(response);

    if (!chat) {
      this.logger.warn(`Чат не найден`);
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }

    return chat;
  }

  async getChatsByUserId(
    userUuid: string,
  ): Promise<ChatWithParticipantsData[]> {
    const userChatsResponse = (await this.supabaseService
      .getClient()
      .from('party')
      .select('chat_id')
      .eq('user_uuid', userUuid)) as SupabaseResponse<
      {
        chat_id: number;
      }[]
    >;

    const userChats =
      this.supabaseService.handleSupabaseResponse<{ chat_id: number }[]>(
        userChatsResponse,
      );

    if (!userChats || userChats.length === 0) {
      this.logger.warn(`Чаты пользователя не найдены`);
      return [];
    }

    const chatIds = userChats.map((chat) => chat.chat_id);

    const response = (await this.supabaseService
      .getClient()
      .from('party')
      .select(
        `
      chat:chat_id (
        chat_id,
        user_uuid,
        name,
        is_group_chat,
        created_at,
        group_chat (
          avatar_url
        )
      ),
      profiles:user_uuid (
        uuid,
        name,
        avatar_url
      )
      `,
      )
      .in('chat_id', chatIds)) as SupabaseResponse<ChatWithParticipantsData[]>;

    const chats =
      this.supabaseService.handleSupabaseResponse<ChatWithParticipantsData[]>(
        response,
      );

    if (!chats) {
      this.logger.warn(`Участники чатов не найдены`);
      throw new HttpException('Participants not found', HttpStatus.NOT_FOUND);
    }

    return chats;
  }

  async getPartyByChatId(chatId: string): Promise<PartyItem[]> {
    const response = (await this.supabaseService
      .getClient()
      .from('party')
      .select(
        `
        chat_id,
        chat:chat_id (
            chat_id,
            user_uuid,
            name,
            is_group_chat,
            created_at
        ),
        profiles:user_uuid (
            uuid,
            name,
            avatar_url
        )
        `,
      )
      .eq('chat_id', chatId)) as SupabaseResponse<PartyItem[]>;

    const party =
      this.supabaseService.handleSupabaseResponse<PartyItem[]>(response);

    if (!party) {
      this.logger.warn(`Участники чата не найдены`);
      throw new HttpException('Party not found', HttpStatus.NOT_FOUND);
    }

    return party;
  }

  async getGroupChatAvatar(chatId: string): Promise<GroupAvatarData> {
    const response = (await this.supabaseService
      .getClient()
      .from('group_chat')
      .select('chat_id, avatar_url')
      .eq('chat_id', chatId)
      .single()) as SupabaseResponse<GroupAvatarData>;

    const avatar =
      this.supabaseService.handleSupabaseResponse<GroupAvatarData>(response);

    if (!avatar) {
      this.logger.warn(`Аватар чата не найден`);
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }

    return avatar;
  }

  async createSingleChat(
    userUuid: string,
    participantsIds: string[],
    name: string,
  ): Promise<ChatData> {
    const response = (await this.supabaseService
      .getClient()
      .from('chat')
      .insert({
        chat_id: Date.now().toString(),
        created_at: new Date(),
        user_uuid: userUuid,
        name: name,
        is_group_chat: participantsIds.length > 2,
      })
      .select(
        `
        chat_id,
        user_uuid,
        name, 
        is_group_chat,
        created_at
         `,
      )
      .single()) as SupabaseResponse<ChatData>;

    const chat =
      this.supabaseService.handleSupabaseResponse<ChatData>(response);

    if (!chat) {
      throw new HttpException(
        'Chat has not been created',
        HttpStatus.BAD_REQUEST,
      );
    }

    return chat;
  }

  async createGroupChat(chatId: string): Promise<boolean> {
    try {
      const response = await this.supabaseService
        .getClient()
        .from('group_chat')
        .insert({
          chat_id: chatId,
          avatar_url: null,
        });

      return !!this.supabaseService.handleSupabaseResponse<ChatData>(response);
    } catch (error) {
      this.logger.error(
        `Ошибка при создании группового чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createParty(chatId: string, participantsIds: string[]): Promise<void> {
    try {
      if (participantsIds.length < 2) {
        throw new HttpException(
          'Нельзя создать чат с одним участником',
          HttpStatus.BAD_REQUEST,
        );
      }

      participantsIds.forEach(async (participant_id) => {
        await this.supabaseService.getClient().from('party').insert({
          chat_id: chatId,
          user_uuid: participant_id,
        });
      });
    } catch (error) {
      this.logger.error(`Ошибка при создании чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteOneOnOneChat(chatId: string, userUuid: string): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('party')
      .update({ is_deleted: true })
      .eq('chat_id', chatId)
      .eq('user_uuid', userUuid);

    if (error) {
      this.logger.error(
        `Ошибка при удалении одиночного чата: ${error.message}`,
      );
      throw new Error(`Error soft deleting one-on-one chat: ${error.message}`);
    }

    return true;
  }

  async deleteGroupChat(chatId: string, userUuid: string): Promise<boolean> {
    const chat = await this.getChatById(chatId);

    if (chat.user_uuid !== userUuid) {
      this.logger.error(`Недостаточно прав для удаления чата`);
      throw new HttpException(
        'There are not enough rights to delete the chat',
        HttpStatus.FORBIDDEN,
      );
    }

    const { error } = await this.supabaseService
      .getClient()
      .from('chat')
      .delete()
      .eq('chat_id', chatId);

    if (error) {
      this.logger.error(
        `Ошибка при удалении группового чата: ${error.message}`,
      );
      throw new Error(`Error deleting group chat: ${error.message}`);
    }

    return true;
  }

  async uploadAvatarToChatStorage(
    buffer: Buffer,
    filePath: string,
    mimetype: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Ошибка при загрузке аватара: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAvatarPublicUrl(chatId: string, fileName: string): Promise<string> {
    try {
      const { data } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(`chats/${chatId}/${fileName}`);

      return data.publicUrl;
    } catch (error) {
      this.logger.error('Ошибка получения публичного URL:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateGroupChatAvatar(
    chatId: string,
    publicURL: string | null,
  ): Promise<void> {
    const { error: updateError } = await this.supabaseService
      .getClient()
      .from('group_chat')
      .update({ avatar_url: publicURL })
      .eq('chat_id', chatId);

    if (updateError) {
      this.logger.error(
        `Ошибка при обновлении аватара: ${updateError.message}`,
      );
      throw new HttpException(
        updateError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCurrentChatAvatar(chatId: string): Promise<{ avatar_url: string }> {
    const response = (await this.supabaseService
      .getClient()
      .from('group_chat')
      .select('avatar_url')
      .eq('chat_id', chatId)
      .single()) as SupabaseResponse<{ avatar_url: string }>;

    const currentChat = this.supabaseService.handleSupabaseResponse<{
      avatar_url: string;
    }>(response);

    if (!currentChat) {
      this.logger.warn(`Аватар чата не найден`);
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }

    return currentChat;
  }

  async checkDeleteAccess(file_path: string): Promise<boolean> {
    const response = await this.supabaseService
      .getClient()
      .rpc('check_chat_delete_access', { file_path });

    const hasAccess =
      this.supabaseService.handleSupabaseResponse<boolean>(response);

    if (!hasAccess) {
      this.logger.error(`Недостаточно прав для удаления аватара`);
      throw new HttpException(
        'There are not enough rights to delete the avatar',
        HttpStatus.FORBIDDEN,
      );
    }

    return hasAccess;
  }

  async removeAvatarFromStorage(avatarPath: string): Promise<void> {
    const { error: deleteError } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .remove([avatarPath]);

    if (deleteError) {
      this.logger.error(`Ошибка при удалении аватара: ${deleteError.message}`);
      throw new HttpException(
        deleteError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChatAvatars(chatId: string): Promise<FileObject[]> {
    const { data: files, error: listError } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .list(`chats/${chatId}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      this.logger.error(
        `Ошибка при получении списка аватаров чата: ${listError.message}`,
      );
      throw new HttpException(
        listError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return files;
  }
}
