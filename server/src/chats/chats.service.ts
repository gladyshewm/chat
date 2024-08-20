import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ChatWithoutMessages } from '../graphql';
import { SupabaseService } from '../supabase/supabase.service';
import { Chat, PartyItem, UserWithAvatarData } from './types/chats.types';
import { PUB_SUB } from '../common/pubsub/pubsub.provider';
import { PubSub } from 'graphql-subscriptions';
import { FileUpload } from 'graphql-upload-ts';
import { AvatarInfoData } from 'users/types/users.types';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    private supabaseService: SupabaseService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  async createChat(
    userUuid: string,
    participantsIds: string[],
    name: string,
  ): Promise<ChatWithoutMessages> {
    participantsIds.push(userUuid);

    try {
      const chatData = await this.createNewChat(
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

      if (chat.isGroupChat) await this.createGroupChat(chat.id);

      for (let i = 0; i < participantsIds.length; i++) {
        const participant = participantsIds[i];
        const participantData = await this.getParticipants(participant);

        chat.participants.push({
          id: participantData.uuid,
          name: participantData.name,
          avatarUrl: participantData.avatar_url,
        });

        await this.createParty(chat.id, participant);
      }

      return chat;
    } catch (error) {
      this.logger.error(`Ошибка при создании чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createNewChat(
    userUuid: string,
    participantsIds: string[],
    name: string,
  ): Promise<Chat> {
    const { data, error } = (await this.supabaseService
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
      )) as {
      data: Chat[];
      error: any;
    };

    if (error) {
      this.logger.error(`Ошибка при создании чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return data[0];
  }

  private async createGroupChat(chatId: string): Promise<void> {
    try {
      await this.supabaseService.getClient().from('group_chat').insert({
        chat_id: chatId,
        avatar_url: null,
      });
    } catch (error) {
      this.logger.error(
        `Ошибка при создании группового чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getParticipants(
    participant: string,
  ): Promise<UserWithAvatarData> {
    const { data: participantData, error: participantError } =
      (await this.supabaseService
        .getClient()
        .from('profiles')
        .select(
          `
              uuid,
              name,
              avatar_url
              `,
        )
        .eq('uuid', participant)) as {
        data: UserWithAvatarData[];
        error: any;
      };

    if (participantError) {
      this.logger.error(
        `Ошибка получения данных участников чата: ${participantError.message}`,
      );
      throw new HttpException(
        participantError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return participantData[0];
  }

  private async createParty(
    chat_id: string,
    participant_id: string,
  ): Promise<void> {
    const { error: partyError } = await this.supabaseService
      .getClient()
      .from('party')
      .insert({
        chat_id: chat_id,
        user_uuid: participant_id,
      });

    if (partyError) {
      this.logger.error(
        `Ошибка при добавлении участника в чат: ${partyError.message}`,
      );
      throw new HttpException(
        partyError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteChat(chatId: string, userUuid: string): Promise<boolean> {
    try {
      const chat = await this.getChatById(chatId);

      if (!chat) {
        this.logger.error(`Чат не найден`);
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
      }

      if (chat.is_group_chat) {
        return this.deleteGroupChat(chat, userUuid);
      } else {
        return this.deleteOneOnOneChat(chat, userUuid);
      }
    } catch (error) {
      this.logger.error(`Ошибка при удалении чата: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getChatById(chatId: string): Promise<Chat | null> {
    const { data, error } = (await this.supabaseService
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
      .single()) as { data: Chat; error: any };

    if (error) {
      this.logger.error(`Ошибка при получении чата: ${error.message}`);
      throw new Error(`Error fetching chat: ${error.message}`);
    }

    if (!data) {
      this.logger.warn(`Чат не найден`);
      return null;
    }

    return data;
  }

  private async deleteGroupChat(
    chat: Chat,
    userUuid: string,
  ): Promise<boolean> {
    if (chat.user_uuid !== userUuid) {
      this.logger.error(`Недостаточно прав для удаления чата`);
      throw new HttpException(
        'Недостаточно прав для удаления чата',
        HttpStatus.FORBIDDEN,
      );
    }

    const { error } = await this.supabaseService
      .getClient()
      .from('chat')
      .delete()
      .eq('chat_id', chat.chat_id);

    if (error) {
      this.logger.error(
        `Ошибка при удалении группового чата: ${error.message}`,
      );
      throw new Error(`Error deleting group chat: ${error.message}`);
    }

    return true;
  }

  private async deleteOneOnOneChat(
    chat: Chat,
    userUuid: string,
  ): Promise<boolean> {
    const { error } = await this.supabaseService
      .getClient()
      .from('party')
      .update({ is_deleted: true })
      .eq('chat_id', chat.chat_id)
      .eq('user_uuid', userUuid);

    if (error) {
      this.logger.error(
        `Ошибка при удалении одиночного чата: ${error.message}`,
      );
      throw new Error(`Error soft deleting one-on-one chat: ${error.message}`);
    }

    return true;
  }

  async getUserChats(userUuid: string): Promise<ChatWithoutMessages[]> {
    try {
      const chatIds = await this.getUserChatIds(userUuid);
      const chatsData = await this.getChatsWithParticipants(chatIds);
      const groupAvatarMap = await this.getGroupAvatarsMap(chatsData);

      return this.buildChatResponse(chatsData, groupAvatarMap);
    } catch (error) {
      this.logger.error(
        `Ошибка при получении чатов пользователя: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getUserChatIds(userUuid: string): Promise<string[]> {
    const { data: userChats, error: chatsError } = await this.supabaseService
      .getClient()
      .from('party')
      .select('chat_id')
      .eq('user_uuid', userUuid);

    if (chatsError) {
      this.logger.error(
        `Ошибка при получении чатов пользователя: ${chatsError.message}`,
      );
      throw new HttpException(
        chatsError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const chatIds = userChats.map((chat) => chat.chat_id);

    return chatIds;
  }

  private async getChatsWithParticipants(
    chatIds: string[],
  ): Promise<PartyItem[]> {
    const { data: chatsData, error: participantsError } =
      (await this.supabaseService
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
        .in('chat_id', chatIds)) as unknown as {
        data: PartyItem[];
        error: any;
      };

    if (participantsError) {
      this.logger.error(
        `Ошибка при получении участников чатов: ${participantsError.message}`,
      );
      throw new HttpException(
        participantsError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return chatsData;
  }

  private async getGroupAvatarsMap(
    chatsData: PartyItem[],
  ): Promise<Map<string, string>> {
    const groupChatIds = chatsData
      .filter((item) => item.chat.is_group_chat)
      .map((item) => item.chat_id);

    const { data: groupAvatars, error: groupAvatarsError } =
      await this.supabaseService
        .getClient()
        .from('group_chat')
        .select('chat_id, avatar_url')
        .in('chat_id', groupChatIds);

    if (groupAvatarsError) {
      this.logger.error(
        `Ошибка при получении аватаров чатов: ${groupAvatarsError.message}`,
      );
      throw new HttpException(
        groupAvatarsError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const groupAvatarMap = new Map(
      groupAvatars.map((item) => [item.chat_id, item.avatar_url]),
    );

    return groupAvatarMap;
  }

  private buildChatResponse(
    chatsData: PartyItem[],
    groupAvatarMap: Map<string, string | null>,
  ): ChatWithoutMessages[] {
    const chatMap = new Map<string, ChatWithoutMessages>();

    chatsData.forEach((item) => {
      if (!chatMap.has(item.chat_id)) {
        chatMap.set(item.chat_id, {
          id: item.chat_id,
          userUuid: item.chat.user_uuid,
          name: item.chat.name,
          isGroupChat: item.chat.is_group_chat,
          groupAvatarUrl: item.chat.is_group_chat
            ? groupAvatarMap.get(item.chat_id) || null
            : null,
          participants: [],
          createdAt: item.chat.created_at,
        });
      }

      const chat = chatMap.get(item.chat_id)!;
      if (!chat.participants.some((p) => p.id === item.profiles.uuid)) {
        chat.participants.push({
          id: item.profiles.uuid,
          name: item.profiles.name,
          avatarUrl: item.profiles.avatar_url,
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
      const chatData = await this.getChatById(chatId);

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

      const chatParticipants = await this.getChatParticipants(chatId);

      if (!chatParticipants) return null;

      chat.participants = chatParticipants.map((item) => ({
        id: item.profiles.uuid,
        name: item.profiles.name,
        avatarUrl: item.profiles.avatar_url,
      }));

      if (chat.isGroupChat) {
        const groupAvatar = await this.getGroupAvatar(chatId);

        chat.groupAvatarUrl = groupAvatar;
      }

      return chat;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении информации о чате: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getChatParticipants(
    chatId: string,
  ): Promise<Pick<PartyItem, 'profiles'>[] | null> {
    const { data: chatParticipants, error } = (await this.supabaseService
      .getClient()
      .from('party')
      .select(
        `
        profiles:user_uuid (
          uuid,
          name,
          avatar_url
        )
      `,
      )
      .eq('chat_id', chatId)) as unknown as {
      data: Pick<PartyItem, 'profiles'>[];
      error: any;
    };

    if (error) {
      this.logger.error(
        `Ошибка при получении участников чата: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!chatParticipants) {
      this.logger.warn(`Участники чата не найдены`);
      return null;
    }

    return chatParticipants;
  }

  private async getGroupAvatar(chatId: string): Promise<string | null> {
    const { data: groupAvatar, error: groupAvatarError } =
      await this.supabaseService
        .getClient()
        .from('group_chat')
        .select('chat_id, avatar_url')
        .eq('chat_id', chatId);

    if (groupAvatarError) {
      this.logger.error(
        `Ошибка при получении аватаров чатов: ${groupAvatarError.message}`,
      );
      throw new HttpException(
        groupAvatarError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!groupAvatar) {
      this.logger.warn(`Аватар чата не найден`);
      return null;
    }

    return groupAvatar[0].avatar_url;
  }

  async uploadChatAvatar(file: FileUpload, chatId: string): Promise<string> {
    const buffer = await this.readFile(file);
    const uniqueFilename = this.generateUniqueFilename(file.filename);
    const filePath = `chats/${chatId}/${uniqueFilename}`;

    await this.uploadAvatarToChatStorage(buffer, filePath, file.mimetype);

    try {
      const publicURL = await this.getAvatarPublicUrl(chatId, uniqueFilename);
      await this.insertChatAvatar(chatId, publicURL);

      return publicURL;
    } catch (error) {
      this.logger.error(`Ошибка получения публичной ссылки: ${error.message}`);
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

  private async uploadAvatarToChatStorage(
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

  private async getAvatarPublicUrl(
    chatId: string,
    fileName: string,
  ): Promise<string> {
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

  private async insertChatAvatar(chatId: string, publicURL: string) {
    const { error: updateError } = await this.supabaseService
      .getClient()
      .from('group_chat')
      .insert({ chat_id: chatId, avatar_url: publicURL });

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

  async updateChatAvatar(
    file: FileUpload,
    chatId: string,
  ): Promise<string | null> {
    const buffer = await this.readFile(file);
    const uniqueFilename = this.generateUniqueFilename(file.filename);
    const filePath = `chats/${chatId}/${uniqueFilename}`;

    await this.uploadAvatarToChatStorage(buffer, filePath, file.mimetype);

    try {
      const publicURL = await this.getAvatarPublicUrl(chatId, uniqueFilename);
      await this.updateGroupChatAvatar(chatId, publicURL);

      return publicURL;
    } catch (error) {
      this.logger.error(`Ошибка получения публичной ссылки: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async updateGroupChatAvatar(
    chatId: string,
    publicURL: string | null,
  ) {
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

  async deleteChatAvatar(chatId: string): Promise<string | null> {
    try {
      const currentChat = await this.getCurrentChatAvatar(chatId);
      if (!currentChat) return null;

      const currentAvatarPath = currentChat.avatar_url
        .split('/')
        .slice(-3)
        .join('/');

      const hasAccess = await this.checkDeleteAccess(currentAvatarPath);

      if (!hasAccess) {
        throw new HttpException(
          'Недостаточно прав для удаления аватара',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.removeAvatarFromStorage(currentAvatarPath);

      const files = await this.listChatAvatars(chatId);
      let newAvatarUrl: string | null = null;

      if (files && files.length > 0) {
        const lastFile = files.sort((a, b) =>
          String(b.created_at).localeCompare(String(a.created_at)),
        )[0];

        const publicUrlData = await this.getAvatarPublicUrl(
          chatId,
          lastFile.name,
        );

        newAvatarUrl = publicUrlData;
      }

      await this.updateGroupChatAvatar(chatId, newAvatarUrl);

      return newAvatarUrl;
    } catch (error) {
      this.logger.error(`Ошибка удаления аватара: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getCurrentChatAvatar(
    chatId: string,
  ): Promise<{ avatar_url: string } | null> {
    const { data: currentChat, error: fetchError } = await this.supabaseService
      .getClient()
      .from('group_chat')
      .select('avatar_url')
      .eq('chat_id', chatId)
      .single();

    if (fetchError) {
      this.logger.error(
        `Ошибка при получении аватара чата: ${fetchError.message}`,
      );
      throw new HttpException(
        fetchError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!currentChat?.avatar_url) return null;

    return currentChat;
  }

  private async checkDeleteAccess(file_path: string): Promise<boolean> {
    const { data: hasAccess, error: accessError } = await this.supabaseService
      .getClient()
      .rpc('check_chat_delete_access', { file_path });

    if (accessError) {
      this.logger.error(`Ошибка при проверке доступа: ${accessError.message}`);
      throw new HttpException(
        accessError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return hasAccess;
  }

  private async removeAvatarFromStorage(avatarPath: string): Promise<void> {
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

  private async listChatAvatars(chatId: string): Promise<AvatarInfoData[]> {
    const { data: files, error: listError } = (await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .list(`chats/${chatId}`)) as unknown as {
      data: AvatarInfoData[];
      error: any;
    };

    if (listError) {
      this.logger.error(
        `Ошибка при получении списка файлов: ${listError.message}`,
      );
      throw new HttpException(
        listError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return files;
  }
}
