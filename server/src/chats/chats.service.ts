import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ChatWithoutMessages, Message, UserWithAvatar } from 'src/graphql';
import { SupabaseService } from 'src/supabase/supabase.service';
import {
  MessageData,
  PartyItem,
  UserWithAvatarData,
} from './types/chats.types';
import { PUB_SUB } from 'src/common/pubsub/pubsub.provider';
import { PubSub } from 'graphql-subscriptions';
import { FileUpload } from 'graphql-upload-ts';

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
    try {
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
          name, 
          is_group_chat,
          created_at
           `,
        )) as {
        data: ChatWithoutMessages;
        error: any;
      };

      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      let chat = data[0];
      chat = {
        id: chat.chat_id,
        name: chat.name,
        isGroupChat: chat.is_group_chat,
        groupAvatarUrl: null,
        participants: [],
      };

      for (let i = 0; i < participantsIds.length; i++) {
        const participant = participantsIds[i];
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
          throw new HttpException(
            participantError.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        chat.participants.push({
          id: participantData[0].uuid,
          name: participantData[0].name,
          avatarUrl: participantData[0].avatar_url,
        });

        const { error: partyError } = await this.supabaseService
          .getClient()
          .from('party')
          .insert({
            chat_id: chat.id,
            user_uuid: participant,
          });

        if (partyError) {
          throw new HttpException(
            partyError.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      return chat;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserChats(userUuid: string): Promise<ChatWithoutMessages[]> {
    try {
      const { data: chatsData, error: chatsError } = (await this.supabaseService
        .getClient()
        .from('party')
        .select(
          `
              chat_id,
              chat:chat_id (
                  chat_id,
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
        )) as /* .neq('user_uuid', userUuid) */ {
        data: PartyItem[];
        error: any;
      };

      if (chatsError) {
        throw new HttpException(
          chatsError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

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
        throw new HttpException(
          groupAvatarsError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const groupAvatarMap = new Map(
        groupAvatars.map((item) => [item.chat_id, item.avatar_url]),
      );

      const chatMap = new Map<string, ChatWithoutMessages>();

      chatsData.forEach((item) => {
        if (!chatMap.has(item.chat_id)) {
          chatMap.set(item.chat_id, {
            id: item.chat_id,
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
        chat.participants.push({
          id: item.profiles.uuid,
          name: item.profiles.name,
          avatarUrl: item.profiles.avatar_url,
        });
      });

      return Array.from(chatMap.values());
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChatMessages(
    chatId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Message[]> {
    try {
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
          .range(offset, offset + limit - 1)) as {
          data: MessageData[];
          error: any;
        };

      if (messagesError) {
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMessage(
    chatId: string,
    content: string,
    userUuid: string,
  ): Promise<Message> {
    try {
      const { data, error } = (await this.supabaseService
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
        )) as { data: MessageData; error: any };

      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      let message = data[0];
      message = {
        id: message.message_id,
        chatId: message.chat_id,
        userId: message.user_uuid,
        content: message.content,
        createdAt: new Date(message.created_at),
        isRead: message.is_read,
        userName: message.profiles.name,
        avatarUrl: message.profiles.avatar_url,
      };

      return message;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMessageSub(
    chatId: string,
    userUuid: string,
    content: string,
  ): Promise<Message> {
    try {
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadChatAvatar(file: FileUpload, chatId: string): Promise<string> {
    const { createReadStream, filename, mimetype } = file;
    const stream = createReadStream();

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `chats/${chatId}/${uniqueFilename}`;

    const { error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const { data: dataPublicURL } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(filePath);

      const publicURL = dataPublicURL.publicUrl;
      await this.insertChatAvatar(chatId, publicURL);

      return publicURL;
    } catch (error) {
      this.logger.error(`Error getting public URL: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async insertChatAvatar(chatId: string, publicURL: string) {
    const { error: updateError } = await this.supabaseService
      .getClient()
      .from('group_chat')
      .insert({ chat_id: chatId, avatar_url: publicURL });

    if (updateError) {
      this.logger.error(`Error updating chat avatar: ${updateError.message}`);
      throw new HttpException(
        updateError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateChatAvatar(
    file: FileUpload,
    chatId: string,
  ): Promise<string> | null {
    const { createReadStream, filename, mimetype } = file;
    const stream = createReadStream();

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `chats/${chatId}/${uniqueFilename}`;

    const { error } = await this.supabaseService
      .getClient()
      .storage.from('avatars')
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const { data: dataPublicURL } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .getPublicUrl(filePath);

      const publicURL = dataPublicURL.publicUrl;
      await this.updateGroupChatAvatar(chatId, publicURL);

      return publicURL;
    } catch (error) {
      this.logger.error(`Error getting public URL: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async updateGroupChatAvatar(chatId: string, publicURL: string) {
    const { error: updateError } = await this.supabaseService
      .getClient()
      .from('group_chat')
      .update({ avatar_url: publicURL })
      .eq('chat_id', chatId);

    if (updateError) {
      this.logger.error(`Error updating chat avatar: ${updateError.message}`);
      throw new HttpException(
        updateError.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteChatAvatar(chatId: string): Promise<string> {
    try {
      const { data: currentChat, error: fetchError } =
        await this.supabaseService
          .getClient()
          .from('group_chat')
          .select('avatar_url')
          .eq('chat_id', chatId)
          .single();

      if (fetchError) {
        this.logger.error(`Error fetching chat: ${fetchError.message}`);
        throw new HttpException(
          fetchError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!currentChat?.avatar_url) return null;

      const currentAvatarPath = currentChat.avatar_url
        .split('/')
        .slice(-3)
        .join('/');

      const { data: hasAccess, error: accessError } = await this.supabaseService
        .getClient()
        .rpc('check_chat_delete_access', { file_path: currentAvatarPath });

      if (accessError) {
        this.logger.error(`Error checking access: ${accessError.message}`);
        throw new HttpException(
          accessError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!hasAccess) {
        throw new HttpException(
          'You do not have permission to delete this chat avatar',
          HttpStatus.FORBIDDEN,
        );
      }

      const { error: deleteError } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .remove([currentAvatarPath]);

      if (deleteError) {
        this.logger.error(`Error deleting file: ${deleteError.message}`);
        throw new HttpException(
          deleteError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const { data: files, error: listError } = await this.supabaseService
        .getClient()
        .storage.from('avatars')
        .list(`chats/${chatId}`);

      if (listError) {
        this.logger.error(`Error listing files: ${listError.message}`);
        throw new HttpException(
          listError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      let newAvatarUrl: string | null = null;
      if (files && files.length > 0) {
        const lastFile = files.sort((a, b) =>
          b.created_at.localeCompare(a.created_at),
        )[0];
        const { data: publicUrlData } = await this.supabaseService
          .getClient()
          .storage.from('avatars')
          .getPublicUrl(`chats/${chatId}/${lastFile.name}`);

        newAvatarUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await this.supabaseService
        .getClient()
        .from('group_chat')
        .update({ avatar_url: newAvatarUrl })
        .eq('chat_id', chatId);

      if (updateError) {
        this.logger.error(`Error updating chat avatar: ${updateError.message}`);
        throw new HttpException(
          updateError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newAvatarUrl;
    } catch (error) {
      this.logger.error(`Error deleting chat avatar: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
