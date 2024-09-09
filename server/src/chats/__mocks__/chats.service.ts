import { ChatsService } from 'chats/chats.service';

export const ChatService: jest.Mock<ChatsService> = jest.fn().mockReturnValue({
  createChat: jest.fn(),
});
