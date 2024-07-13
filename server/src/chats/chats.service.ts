import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatWithoutMessages, Message } from 'src/graphql';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MessageData, PartyItem } from './types/chats.types';

@Injectable()
export class ChatsService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserChats(userUuid: string): Promise<ChatWithoutMessages[]> {
    try {
      const { data, error } = (await this.supabaseService
        .getClient()
        .from('party')
        .select(
          `
              chat_id,
              chat:chat_id (
                  chat_id,
                  name
              ),
              profiles:user_uuid (
                  uuid,
                  name,
                  avatar_url
              )
              `,
        )
        .neq('user_uuid', userUuid)) as { data: PartyItem[]; error: any };

      if (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const chatMap = new Map<string, ChatWithoutMessages>();

      data.forEach((item) => {
        if (!chatMap.has(item.chat_id)) {
          chatMap.set(item.chat_id, {
            id: item.chat_id,
            name: item.chat.name,
            participants: [],
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
}
