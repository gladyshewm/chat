import { Test, TestingModule } from '@nestjs/testing';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { JwtHttpAuthGuard } from 'auth/guards/jwt-http-auth.guard';
import { AvatarInfo, ChatWithoutMessages } from 'generated_graphql';
import { mockGqlContext } from '__mocks__/gql-context.mock';
import {
  chatAvatarStub,
  chatWithoutMessagesStub,
  userWithAvatarStub,
} from './stubs/chats.stub';
import { FileUpload } from 'graphql-upload-ts';

jest.mock('./chats.service');

describe('ChatsResolver', () => {
  let chatsResolver: ChatsResolver;
  let chatsService: jest.Mocked<ChatsService>;

  const mockJwtHttpAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsResolver, ChatsService],
    })
      .overrideGuard(JwtHttpAuthGuard)
      .useValue(mockJwtHttpAuthGuard)
      .compile();

    chatsResolver = module.get<ChatsResolver>(ChatsResolver);
    chatsService = module.get<jest.Mocked<ChatsService>>(ChatsService);
  });

  it('should be defined', () => {
    expect(chatsResolver).toBeDefined();
  });

  describe('createChat', () => {
    let createdChat: ChatWithoutMessages;
    const mockCtx = mockGqlContext();
    const userUuid = mockCtx.user_uuid;
    const participantsIds = ['id', 'id2', 'id3'];
    const participants = participantsIds.map((id) => userWithAvatarStub(id));
    const chatName = 'mockChatName';

    beforeEach(async () => {
      chatsService.createChat.mockResolvedValue(
        chatWithoutMessagesStub('mockId', chatName, userUuid, participants),
      );
      createdChat = await chatsResolver.createChat(
        participantsIds,
        chatName,
        userUuid,
      );
    });

    it('should call chatsService.createChat with correct data', async () => {
      expect(chatsService.createChat).toHaveBeenCalledWith(
        userUuid,
        participantsIds,
        chatName,
      );
    });

    it('should return created chat', async () => {
      expect(createdChat).toEqual(
        chatWithoutMessagesStub('mockId', chatName, userUuid, participants),
      );
    });

    it('should return correct chat structure', () => {
      expect(createdChat).toHaveProperty('id');
      expect(createdChat).toHaveProperty('name');
      expect(createdChat).toHaveProperty('userUuid');
      expect(createdChat).toHaveProperty('isGroupChat');
      expect(createdChat).toHaveProperty('groupAvatarUrl');
      expect(createdChat).toHaveProperty('participants');
      expect(createdChat).toHaveProperty('createdAt');
    });
  });

  describe('deleteChat', () => {
    let isDeletedChat: boolean;
    const mockCtx = mockGqlContext();
    const userUuid = mockCtx.user_uuid;
    const chatId = '12312213213';

    beforeEach(async () => {
      isDeletedChat = await chatsResolver.deleteChat(chatId, userUuid);
    });

    it('should call chatsService.deleteChat with correct data', async () => {
      expect(chatsService.deleteChat).toHaveBeenCalledWith(chatId, userUuid);
    });

    it('should return true if chat is deleted', async () => {
      chatsService.deleteChat.mockResolvedValue(true);
      isDeletedChat = await chatsResolver.deleteChat(chatId, userUuid);

      expect(isDeletedChat).toBeTruthy();
    });

    it('should propagate error if chatsService.deleteChat throws an error', async () => {
      chatsService.deleteChat.mockRejectedValue(new Error('Service Error'));

      await expect(chatsResolver.deleteChat(chatId, userUuid)).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe('getUserChats', () => {
    let userChats: ChatWithoutMessages[];
    const mockCtx = mockGqlContext();
    const userUuid = mockCtx.user_uuid;

    beforeEach(async () => {
      userChats = await chatsResolver.getUserChats(userUuid);
    });

    it('should call chatsService.getUserChats correct data', async () => {
      expect(chatsService.getUserChats).toHaveBeenCalledWith(userUuid);
    });

    it("should return user's chats", async () => {
      const chats = [
        chatWithoutMessagesStub('mockName1', userUuid),
        chatWithoutMessagesStub('mockName2', userUuid),
      ];

      chatsService.getUserChats.mockResolvedValue(chats);
      userChats = await chatsResolver.getUserChats(userUuid);

      expect(userChats).toEqual(chats);
    });

    it('should return empty array if user has no chats', async () => {
      chatsService.getUserChats.mockResolvedValue([]);
      userChats = await chatsResolver.getUserChats(userUuid);

      expect(userChats).toEqual([]);
    });

    it('should propagate error if chatsService.getUserChats throws an error', async () => {
      chatsService.getUserChats.mockRejectedValue(new Error('Service Error'));

      await expect(chatsResolver.getUserChats(userUuid)).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe('getChatWithUser', () => {
    let chatWithUser: ChatWithoutMessages | null;
    const mockCtx = mockGqlContext();
    const userUuid = mockCtx.user_uuid;
    const withUserUuid = 'withUserUuid';
    const withUser = userWithAvatarStub(withUserUuid);

    beforeEach(async () => {
      chatsService.getChatWithUser.mockResolvedValue(
        chatWithoutMessagesStub('mockId', 'mockName', userUuid, [withUser]),
      );
      chatWithUser = await chatsResolver.getChatWithUser(
        withUserUuid,
        userUuid,
      );
    });

    it('should call chatsService.getChatWithUser correct data', async () => {
      expect(chatsService.getChatWithUser).toHaveBeenCalledWith(
        userUuid,
        withUserUuid,
      );
    });

    it('should return chat with user', async () => {
      expect(chatWithUser).toEqual(
        chatWithoutMessagesStub('mockId', 'mockName', userUuid, [withUser]),
      );
    });

    it('should return null if chat with user not found', async () => {
      chatsService.getChatWithUser.mockResolvedValue(null);
      chatWithUser = await chatsResolver.getChatWithUser(
        withUserUuid,
        userUuid,
      );

      expect(chatWithUser).toBeNull();
    });

    it('should propagate error if chatsService.getChatWithUser throws an error', async () => {
      chatsService.getChatWithUser.mockRejectedValue(
        new Error('Service Error'),
      );

      await expect(
        chatsResolver.getChatWithUser(withUserUuid, userUuid),
      ).rejects.toThrow('Service Error');
    });
  });

  describe('getChatAllAvatars', () => {
    let chatAllAvatars: AvatarInfo[];
    const chatId = '12312213213';
    const avatars = [
      chatAvatarStub('mockAvatarName1'),
      chatAvatarStub('mockAvatarName2'),
      chatAvatarStub('mockAvatarName3'),
    ];

    beforeEach(async () => {
      chatsService.getChatAllAvatars.mockResolvedValue(avatars);
      chatAllAvatars = await chatsResolver.getChatAllAvatars(chatId);
    });

    it('should call chatsService.getChatAllAvatars with correct data', async () => {
      expect(chatsService.getChatAllAvatars).toHaveBeenCalledWith(chatId);
    });

    it('should return array of avatars', async () => {
      expect(chatAllAvatars).toEqual(avatars);
    });

    it('should propagate error if chatsService.chatAllAvatars throws an error', async () => {
      chatsService.getChatAllAvatars.mockRejectedValue(
        new Error('Service Error'),
      );

      await expect(chatsResolver.getChatAllAvatars(chatId)).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe('getChatInfoById', () => {
    let chatInfo: ChatWithoutMessages | null;
    const chatId = '12312213213';
    const chat = chatWithoutMessagesStub('mockName', 'mockUserUuid');

    beforeEach(async () => {
      chatsService.getChatInfoById.mockResolvedValue(chat);
      chatInfo = await chatsResolver.getChatInfoById(chatId);
    });

    it('should call chatsService.getChatInfoById with correct data', async () => {
      expect(chatsService.getChatInfoById).toHaveBeenCalledWith(chatId);
    });

    it('should return chat info', async () => {
      expect(chatInfo).toEqual(chat);
    });

    it('should propagate error if chatsService.getChatInfoById throws an error', async () => {
      chatsService.getChatInfoById.mockRejectedValue(
        new Error('Service Error'),
      );

      await expect(chatsResolver.getChatInfoById(chatId)).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe('uploadChatAvatar', () => {
    let chatId: string;
    let image: FileUpload;

    beforeEach(() => {
      chatId = '12312213213';
      image = {
        filename: 'mockFilename',
        mimetype: 'mockMimetype',
        createReadStream: jest.fn(),
      } as unknown as FileUpload;
    });

    it('should call chatsService.uploadChatAvatar with correct data', async () => {
      await chatsResolver.uploadChatAvatar(image, chatId);
      expect(chatsService.uploadChatAvatar).toHaveBeenCalledWith(image, chatId);
    });

    it('should return public URL of uploaded image', async () => {
      chatsService.uploadChatAvatar.mockResolvedValue('mockUrl');
      const result = await chatsResolver.uploadChatAvatar(image, chatId);

      expect(result).toBe('mockUrl');
    });

    it('should propagate error if chatsService.uploadChatAvatar throws an error', async () => {
      chatsService.uploadChatAvatar.mockRejectedValue(
        new Error('Service Error'),
      );

      await expect(
        chatsResolver.uploadChatAvatar(image, chatId),
      ).rejects.toThrow('Service Error');
    });
  });

  describe('deleteChatAvatar', () => {
    const chatId = '12312213213';
    const avatarUrl = 'mockUrl';

    it('should call chatsService.deleteChatAvatar with correct data', async () => {
      await chatsResolver.deleteChatAvatar(chatId, avatarUrl);

      expect(chatsService.deleteChatAvatar).toHaveBeenCalledWith(
        chatId,
        avatarUrl,
      );
    });

    it('should return public URL of the new avatar', async () => {
      const newAvatarUrl = 'newMockUrl';
      chatsService.deleteChatAvatar.mockResolvedValue(newAvatarUrl);
      const result = await chatsResolver.deleteChatAvatar(chatId, avatarUrl);

      expect(result).toBe(newAvatarUrl);
    });

    it('should propagate error if chatsService.deleteChatAvatar throws an error', async () => {
      chatsService.deleteChatAvatar.mockRejectedValue(
        new Error('Service Error'),
      );

      await expect(
        chatsResolver.deleteChatAvatar(chatId, avatarUrl),
      ).rejects.toThrow('Service Error');
    });
  });
});
