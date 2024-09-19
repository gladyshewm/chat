import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import {
  CHAT_REPOSITORY,
  ChatRepository,
  SupabaseChatRepository,
} from './chats.repository';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import {
  chatDataStub,
  chatWithoutMessagesStub,
  chatWithParticipantsDataStub,
  groupAvatarDataStub,
  partyItemStub,
  profileDataStub,
  userWithAvatarStub,
} from './stubs/chats.stub';
import { AvatarInfo, ChatWithoutMessages } from '../generated_graphql';
import { ChatWithParticipantsData } from './models/chats.model';
import { fileStub } from '../auth/stubs/users.stub';
import { fileUploadStub } from './stubs/files.stub';

jest.mock('./chats.repository');
jest.mock('../users/users.service');
jest.mock('../files/files.service');

describe('ChatsService', () => {
  let chatsService: ChatsService;
  let usersService: jest.Mocked<UsersService>;
  let filesService: jest.Mocked<FilesService>;
  let chatRepository: jest.Mocked<ChatRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        UsersService,
        FilesService,
        { provide: CHAT_REPOSITORY, useClass: SupabaseChatRepository },
      ],
    }).compile();

    chatsService = module.get<ChatsService>(ChatsService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
    filesService = module.get<jest.Mocked<FilesService>>(FilesService);
    chatRepository = module.get<jest.Mocked<ChatRepository>>(CHAT_REPOSITORY);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(chatsService).toBeDefined();
  });

  describe('isParticipant', () => {
    const userUuid = 'testUserUuid';
    const chatId = 'testChatId';

    it('should call chatRepository.isParticipant', async () => {
      chatRepository.isParticipant.mockResolvedValue(true);
      await chatsService.isParticipant(chatId, userUuid);

      expect(chatRepository.isParticipant).toHaveBeenCalledWith(
        chatId,
        userUuid,
      );
    });

    it('should return true if user is participant in chat', async () => {
      chatRepository.isParticipant.mockResolvedValue(true);
      const result = await chatsService.isParticipant(chatId, userUuid);

      expect(result).toBeTruthy();
    });

    it('should return false if user is not participant in chat', async () => {
      chatRepository.isParticipant.mockResolvedValue(false);
      const result = await chatsService.isParticipant(chatId, userUuid);

      expect(result).toBeFalsy();
    });

    it('should propagate error if chatRepository.isParticipant throws an error', async () => {
      chatRepository.isParticipant.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(
        chatsService.isParticipant(chatId, userUuid),
      ).rejects.toThrow('Repository error');
    });
  });

  describe('createChat', () => {
    const userUuid = 'testUserUuid';
    const participantsIds = ['testParticipant1', 'testParticipant2'];
    const participantsLength = participantsIds.length;
    // const participants = participantsIds.map((id) => userWithAvatarStub(id));
    const chatId = 'testChatId';
    const name = 'testChatName';
    const isGroupChat = true;
    const chat = chatDataStub(chatId, name, userUuid, isGroupChat);
    let createdChat: ChatWithoutMessages;

    beforeEach(async () => {
      chatRepository.createSingleChat.mockResolvedValue(chat);
      usersService.getUser.mockImplementation((participantsId: string) => {
        return Promise.resolve({
          uuid: participantsId,
          name: 'string',
          avatar_url: 'Nullable<string>',
        });
      });
      chatRepository.createParty.mockResolvedValue();
    });

    it("should include the creator's uuid in the list of participants", async () => {
      const Ids = [...participantsIds];
      createdChat = await chatsService.createChat(userUuid, Ids, name);

      expect(Ids).toContain(userUuid);
      expect(Ids).toHaveLength(participantsLength + 1);
    });

    it('should call chatRepository.createSingleChat', async () => {
      await chatsService.createChat(userUuid, participantsIds, name);
      expect(chatRepository.createSingleChat).toHaveBeenCalledWith(
        userUuid,
        participantsIds,
        name,
      );
    });

    it('should call chatRepository.createGroupChat if chat is group', async () => {
      await chatsService.createChat(userUuid, participantsIds, name);
      expect(chatRepository.createGroupChat).toHaveBeenCalled();
    });

    it('should not call chatRepository.createGroupChat if chat is not group', async () => {
      const isGroupChat = false;
      const chat = chatDataStub(chatId, name, userUuid, isGroupChat);
      chatRepository.createSingleChat.mockResolvedValue(chat);
      await chatsService.createChat(userUuid, participantsIds, name);

      expect(chatRepository.createGroupChat).not.toHaveBeenCalled();
    });

    it('should call chatRepository.createParty', async () => {
      await chatsService.createChat(userUuid, participantsIds, name);

      expect(chatRepository.createParty).toHaveBeenCalledWith(
        chat.chat_id,
        participantsIds,
      );
    });

    it('should return the created chat', async () => {
      const Ids = [...participantsIds];
      const participants = Ids.map((id) => userWithAvatarStub(id));

      createdChat = await chatsService.createChat(userUuid, Ids, name);

      const updatedParticipants = [
        ...participants,
        userWithAvatarStub(userUuid),
      ];
      const newChat = chatWithoutMessagesStub(
        chatId,
        name,
        userUuid,
        updatedParticipants,
        isGroupChat,
      );

      expect(createdChat).toEqual(newChat);
    });

    it('should propagate error if chatRepository.createSingleChat throws an error', async () => {
      chatRepository.createSingleChat.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(
        chatsService.createChat(userUuid, participantsIds, name),
      ).rejects.toThrow('Repository error');
    });
  });

  describe('deleteChat', () => {
    let isDeleted: boolean;
    const userUuid = 'testUserUuid';
    const chatId = 'testChatId';
    const name = 'testChatName';
    const isGroupChat = false;

    beforeEach(async () => {
      chatRepository.getChatById.mockResolvedValue(
        chatDataStub(chatId, name, userUuid, isGroupChat),
      );
      chatRepository.deleteOneOnOneChat.mockResolvedValue(true);
      chatRepository.deleteGroupChat.mockResolvedValue(true);
    });

    it('should call chatRepository.getChatById', async () => {
      await chatsService.deleteChat(chatId, userUuid);
      expect(chatRepository.getChatById).toHaveBeenCalledWith(chatId);
    });

    it('should call chatRepository.deleteOneOnOneChat if chat is not group', async () => {
      await chatsService.deleteChat(chatId, userUuid);
      expect(chatRepository.deleteOneOnOneChat).toHaveBeenCalledWith(
        chatId,
        userUuid,
      );
    });

    it('should call chatRepository.deleteGroupChat if chat is group', async () => {
      const isGroupChat = true;
      chatRepository.getChatById.mockResolvedValue(
        chatDataStub(chatId, name, userUuid, isGroupChat),
      );
      await chatsService.deleteChat(chatId, userUuid);

      expect(chatRepository.deleteGroupChat).toHaveBeenCalledWith(
        chatId,
        userUuid,
      );
    });

    it('should return true if chat is deleted', async () => {
      isDeleted = await chatsService.deleteChat(chatId, userUuid);
      expect(isDeleted).toBeTruthy();
    });

    it('should propagate error if chatRepository throws an error', async () => {
      chatRepository.getChatById.mockRejectedValue(
        new Error('Repository error'),
      );
      await expect(chatsService.deleteChat(chatId, userUuid)).rejects.toThrow(
        'Repository error',
      );
    });
  });

  describe('getUserChats', () => {
    let userChats: ChatWithoutMessages[];
    const userUuid = 'testUserUuid';
    const isGroupChat = true;
    const chat1 = chatDataStub('chatId1', 'Test Chat 1', userUuid, isGroupChat);
    const chat2 = chatDataStub('chatId1', 'Test Chat 1', userUuid, isGroupChat);
    const chat3 = chatDataStub(
      'chatId2',
      'Test Chat 2',
      userUuid,
      !isGroupChat,
    );
    const user1 = profileDataStub('profileUuid1', 'User 1', 'avatar1.png');
    const user2 = profileDataStub('profileUuid2', 'User 2', 'avatar2.png');
    const user3 = profileDataStub('profileUuid3', 'User 3', 'avatar3.png');
    const chatData: ChatWithParticipantsData[] = [
      chatWithParticipantsDataStub(chat1, user1, 'groupAvatar1.png'),
      chatWithParticipantsDataStub(chat2, user2, 'groupAvatar1.png'),
      chatWithParticipantsDataStub(chat3, user3, undefined),
    ];
    /* const chatData: ChatWithParticipantsData[] = [
      {
        chat: {
          chat_id: 'chatId1',
          user_uuid: userUuid,
          name: 'Test Chat 1',
          is_group_chat: true,
          group_chat: { avatar_url: 'groupAvatar1.png' },
          created_at: new Date('2024-09-09T18:13:11.180Z'),
        },
        profiles: {
          uuid: 'profileUuid1',
          name: 'User 1',
          avatar_url: 'avatar1.png',
        },
      },
      {
        chat: {
          chat_id: 'chatId1',
          user_uuid: userUuid,
          name: 'Test Chat 1',
          is_group_chat: true,
          group_chat: { avatar_url: 'groupAvatar1.png' },
          created_at: new Date('2024-09-09T18:13:11.180Z'),
        },
        profiles: {
          uuid: 'profileUuid2',
          name: 'User 2',
          avatar_url: 'avatar2.png',
        },
      },
      {
        chat: {
          chat_id: 'chatId2',
          user_uuid: userUuid,
          name: 'Test Chat 2',
          is_group_chat: false,
          group_chat: { avatar_url: undefined },
          created_at: new Date('2024-09-09T18:13:11.180Z'),
        },
        profiles: {
          uuid: 'profileUuid3',
          name: 'User 3',
          avatar_url: 'avatar3.png',
        },
      },
    ]; */

    beforeEach(async () => {
      chatRepository.getChatsByUserId.mockResolvedValue(chatData);
    });

    it('should call chatRepository.getChatsByUserId', async () => {
      await chatsService.getUserChats(userUuid);

      expect(chatRepository.getChatsByUserId).toHaveBeenCalledWith(userUuid);
    });

    it('should return formatted chats with participants', async () => {
      userChats = await chatsService.getUserChats(userUuid);

      expect(userChats).toEqual([
        {
          id: 'chatId1',
          userUuid,
          name: 'Test Chat 1',
          isGroupChat: true,
          groupAvatarUrl: 'groupAvatar1.png',
          participants: [
            { id: 'profileUuid1', name: 'User 1', avatarUrl: 'avatar1.png' },
            { id: 'profileUuid2', name: 'User 2', avatarUrl: 'avatar2.png' },
          ],
          createdAt: new Date('2024-09-09T18:13:11.180Z'),
        },
        {
          id: 'chatId2',
          userUuid,
          name: 'Test Chat 2',
          isGroupChat: false,
          groupAvatarUrl: null,
          participants: [
            { id: 'profileUuid3', name: 'User 3', avatarUrl: 'avatar3.png' },
          ],
          createdAt: new Date('2024-09-09T18:13:11.180Z'),
        },
      ]);
    });

    it('should throw an error if chatRepository fails', async () => {
      chatRepository.getChatsByUserId.mockRejectedValue(
        new Error('Test error'),
      );

      await expect(chatsService.getUserChats(userUuid)).rejects.toThrow(
        'Test error',
      );
    });
  });

  describe('getChatWithUser', () => {
    let chatWithUser: ChatWithoutMessages | null;
    const userUuid = 'testUserUuid';
    const otherUserId1 = 'otherUserUuid';
    const otherUserId2 = 'otherUserUuid3';
    const userChats = [
      {
        id: 'chatId1',
        userUuid,
        name: 'Test Chat 1',
        isGroupChat: false,
        groupAvatarUrl: null,
        participants: [
          { id: userUuid, name: 'User 1', avatarUrl: 'avatar1.png' },
          { id: otherUserId1, name: 'User 2', avatarUrl: 'avatar2.png' },
        ],
        createdAt: new Date(),
      },
      {
        id: 'chatId2',
        userUuid,
        name: 'Test Group Chat',
        isGroupChat: true,
        groupAvatarUrl: 'groupAvatar.png',
        participants: [
          { id: userUuid, name: 'User 1', avatarUrl: 'avatar1.png' },
          { id: otherUserId2, name: 'User 3', avatarUrl: 'avatar3.png' },
        ],
        createdAt: new Date(),
      },
    ];

    beforeEach(async () => {
      chatRepository.getChatsByUserId.mockResolvedValue({} as any);
    });

    it('should call getUserChats', async () => {
      jest.spyOn(chatsService, 'getUserChats').mockResolvedValue(userChats);
      await chatsService.getChatWithUser(userUuid, otherUserId1);

      expect(chatsService.getUserChats).toHaveBeenCalledWith(userUuid);
    });

    it('should return chat with user if it exists', async () => {
      jest.spyOn(chatsService, 'getUserChats').mockResolvedValue(userChats);

      chatWithUser = await chatsService.getChatWithUser(userUuid, otherUserId1);

      expect(chatWithUser).toEqual(userChats[0]);
    });

    it('should return null if no chat with the other user is found', async () => {
      const userChatsWithoutOtherUser = [
        {
          id: 'chatId2',
          userUuid,
          name: 'Test Group Chat',
          isGroupChat: true,
          groupAvatarUrl: 'groupAvatar.png',
          participants: [
            { id: 'testUserUuid', name: 'User 1', avatarUrl: 'avatar1.png' },
            { id: 'otherUserUuid3', name: 'User 3', avatarUrl: 'avatar3.png' },
          ],
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(chatsService, 'getUserChats')
        .mockResolvedValue(userChatsWithoutOtherUser);

      chatWithUser = await chatsService.getChatWithUser(userUuid, otherUserId1);

      expect(chatWithUser).toBeNull();
    });

    it('should throw an error if getUserChats fails', async () => {
      jest
        .spyOn(chatsService, 'getUserChats')
        .mockRejectedValue(new Error('Test error'));

      await expect(
        chatsService.getChatWithUser(userUuid, otherUserId1),
      ).rejects.toThrow('Test error');
    });
  });

  describe('addUserToChat', () => {
    let result: ChatWithoutMessages;
    const chatId = '12312213213';
    const userUuid = 'mockUserUuid';
    const currentUserUuid = 'mockCurrentUserUuid';
    const participants = [
      userWithAvatarStub('uuid1'),
      userWithAvatarStub('uuid2'),
    ];
    const mockUpdatedChat = chatWithoutMessagesStub(
      chatId,
      'mockChatName',
      userUuid,
      participants,
    );
    const mockChat = chatDataStub(chatId, 'chatName', currentUserUuid, false);

    beforeEach(async () => {
      chatRepository.isParticipant.mockResolvedValue(false);
      // this.getChatInfoById
      chatRepository.getChatById.mockResolvedValue(mockChat);
      chatRepository.getPartyByChatId.mockResolvedValueOnce([
        partyItemStub(),
        partyItemStub(),
      ]);
      chatRepository.getGroupChatAvatar.mockResolvedValue(
        groupAvatarDataStub(),
      );
      chatRepository.getPartyByChatId.mockResolvedValueOnce([
        partyItemStub(mockChat),
        partyItemStub(mockChat),
        partyItemStub(mockChat),
      ]);
    });

    it('should call chatRepository.addUserToChat with correct data', async () => {
      await chatsService.addUserToChat(chatId, userUuid, currentUserUuid);
      expect(chatRepository.addUserToChat).toHaveBeenCalledWith(
        chatId,
        userUuid,
      );
    });

    //TODO: should add a user to the chat when current user is the creator
    //TODO: should throw an error when current user is not the creator
    //TODO: should throw an error when user is already a participant
  });

  describe('getChatAllAvatars', () => {
    let chatAvatars: AvatarInfo[];
    const chatId = 'testChatId';
    const files = [fileStub(), fileStub()];

    beforeEach(async () => {
      chatRepository.getChatAvatars.mockResolvedValue(files);
      chatRepository.getAvatarPublicUrl.mockResolvedValue('publicUrl');
    });

    it('should call chatRepository.getChatAvatars', async () => {
      await chatsService.getChatAllAvatars(chatId);

      expect(chatRepository.getChatAvatars).toHaveBeenCalledWith(chatId);
    });

    it('should call chatRepository.getAvatarPublicUrl', async () => {
      const fileNames = files.map((file) => file.name);
      await chatsService.getChatAllAvatars(chatId);

      expect(chatRepository.getAvatarPublicUrl).toHaveBeenCalledWith(
        chatId,
        fileNames[0],
      );
      expect(chatRepository.getAvatarPublicUrl).toHaveBeenCalledWith(
        chatId,
        fileNames[1],
      );
    });

    it('should return chat avatars', async () => {
      chatAvatars = await chatsService.getChatAllAvatars(chatId);

      expect(chatAvatars).toEqual([
        {
          url: 'publicUrl',
          name: files[0].name,
          createdAt: new Date(files[0].created_at),
        },
        {
          url: 'publicUrl',
          name: files[1].name,
          createdAt: new Date(files[1].created_at),
        },
      ]);
    });

    it('should return empty array if chatRepository.getChatAvatars returns empty array', async () => {
      chatRepository.getChatAvatars.mockResolvedValue([]);
      chatAvatars = await chatsService.getChatAllAvatars(chatId);

      expect(chatAvatars).toEqual([]);
    });

    it('should throw an error if chatRepository.getChatAvatars fails', async () => {
      jest
        .spyOn(chatRepository, 'getChatAvatars')
        .mockRejectedValue(new Error('Test error'));

      await expect(chatsService.getChatAllAvatars(chatId)).rejects.toThrow(
        'Test error',
      );
    });
  });

  describe('getChatInfoById', () => {
    let chatInfo: ChatWithoutMessages | null;
    const chatId = 'testChatId';
    const chatName = 'testName';
    const chatUserUuid = 'testUserUuid';
    const isGroupChat = false;

    beforeEach(async () => {
      chatRepository.getChatById.mockResolvedValue(
        chatDataStub(chatId, chatName, chatUserUuid, isGroupChat),
      );
      chatRepository.getPartyByChatId.mockResolvedValue([
        partyItemStub(),
        partyItemStub(),
      ]);
      chatRepository.getGroupChatAvatar.mockResolvedValue(
        groupAvatarDataStub(),
      );
    });

    it('should call chatRepository.getChatById', async () => {
      await chatsService.getChatInfoById(chatId);

      expect(chatRepository.getChatById).toHaveBeenCalledWith(chatId);
    });

    it('should call chatRepository.getPartyByChatId', async () => {
      await chatsService.getChatInfoById(chatId);

      expect(chatRepository.getPartyByChatId).toHaveBeenCalledWith(chatId);
    });

    it('should call chatRepository.getGroupChatAvatar if chat is group', async () => {
      const isGroupChat = true;
      chatRepository.getChatById.mockResolvedValue(
        chatDataStub(chatId, chatName, chatUserUuid, isGroupChat),
      );
      await chatsService.getChatInfoById(chatId);

      expect(chatRepository.getGroupChatAvatar).toHaveBeenCalledWith(chatId);
    });

    it('should return chat info', async () => {
      chatInfo = await chatsService.getChatInfoById(chatId);

      expect(chatInfo).toEqual({
        id: chatId,
        name: chatName,
        userUuid: chatUserUuid,
        isGroupChat,
        groupAvatarUrl: null,
        participants: [
          {
            id: 'mockUuid',
            name: 'mockName',
            avatarUrl: 'http://mockUrl.com',
          },
          {
            id: 'mockUuid',
            name: 'mockName',
            avatarUrl: 'http://mockUrl.com',
          },
        ],
        createdAt: new Date('2024-09-09T18:13:11.180Z'),
      });
    });

    it('should propagate error if chatRepository.getChatById throws an error', async () => {
      chatRepository.getChatById.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(chatsService.getChatInfoById('testChatId')).rejects.toThrow(
        'Repository error',
      );
    });
  });

  describe('uploadChatAvatar', () => {
    let publicURL: string;
    const chatId = 'testChatId';
    const file = fileUploadStub();
    const buffer = Buffer.from('test');
    const uniqueFilename = 'testFilename';

    beforeEach(async () => {
      filesService.readFile.mockResolvedValue(buffer);
      filesService.generateUniqueFilename.mockReturnValue(uniqueFilename);
      chatRepository.getAvatarPublicUrl.mockResolvedValue('publicUrl');
    });

    it('should call filesService.readFile', async () => {
      await chatsService.uploadChatAvatar(file, chatId);

      expect(filesService.readFile).toHaveBeenCalledWith(file);
    });

    it('should call filesService.generateUniqueFilename', async () => {
      await chatsService.uploadChatAvatar(file, chatId);

      expect(filesService.generateUniqueFilename).toHaveBeenCalledWith(
        file.filename,
      );
    });

    it('should call chatRepository.uploadAvatarToChatStorage', async () => {
      const filePath = `chats/${chatId}/${uniqueFilename}`;
      await chatsService.uploadChatAvatar(file, chatId);

      expect(chatRepository.uploadAvatarToChatStorage).toHaveBeenCalledWith(
        buffer,
        filePath,
        file.mimetype,
      );
    });

    it('should call chatRepository.getAvatarPublicUrl', async () => {
      await chatsService.uploadChatAvatar(file, chatId);

      expect(chatRepository.getAvatarPublicUrl).toHaveBeenCalledWith(
        chatId,
        uniqueFilename,
      );
    });

    it('should call chatRepository.updateGroupChatAvatar', async () => {
      publicURL = await chatsService.uploadChatAvatar(file, chatId);

      expect(chatRepository.updateGroupChatAvatar).toHaveBeenCalledWith(
        chatId,
        publicURL,
      );
    });

    it('should return publicURL', async () => {
      publicURL = await chatsService.uploadChatAvatar(file, chatId);

      expect(publicURL).toBe('publicUrl');
    });

    it('should propagate error if filesService throws an error', async () => {
      filesService.readFile.mockRejectedValue(new Error('File error'));

      await expect(chatsService.uploadChatAvatar(file, chatId)).rejects.toThrow(
        'File error',
      );
    });

    it('should propagate error if chatRepository throws an error', async () => {
      chatRepository.uploadAvatarToChatStorage.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(chatsService.uploadChatAvatar(file, chatId)).rejects.toThrow(
        'Repository error',
      );
    });
  });

  describe('deleteChatAvatar', () => {
    let newAvatarUrl: string | null;
    const chatId = 'testChatId';
    const avatarUrlToDelete =
      'https://wppewaapojghqafjsuvm.supabase.co/storage/v1/object/public/avatars/chats/1/test.png';
    const currentChatAvatar =
      'https://wppewaapojghqafjsuvm.supabase.co/storage/v1/object/public/avatars/chats/1/current.png';
    const chatAvatars = [fileStub('first'), fileStub('second')];

    beforeEach(async () => {
      chatRepository.getCurrentChatAvatar.mockResolvedValue({
        avatar_url: currentChatAvatar,
      });
      chatRepository.checkDeleteAccess.mockResolvedValue(true);
      chatRepository.getChatAvatars.mockResolvedValue(chatAvatars);
      chatRepository.getAvatarPublicUrl.mockResolvedValue(avatarUrlToDelete);
    });

    it('should call chatRepository.getCurrentChatAvatar', async () => {
      await chatsService.deleteChatAvatar(chatId, avatarUrlToDelete);

      expect(chatRepository.getCurrentChatAvatar).toHaveBeenCalledWith(chatId);
    });

    it('should call chatRepository.checkDeleteAccess', async () => {
      const avatarPathToDelete = avatarUrlToDelete
        .split('/')
        .slice(-3)
        .join('/');
      await chatsService.deleteChatAvatar(chatId, avatarUrlToDelete);

      expect(chatRepository.checkDeleteAccess).toHaveBeenCalledWith(
        avatarPathToDelete,
      );
    });

    it('should throw error if chatRepository.checkDeleteAccess returns false', async () => {
      chatRepository.checkDeleteAccess.mockResolvedValue(false);

      await expect(
        chatsService.deleteChatAvatar(chatId, avatarUrlToDelete),
      ).rejects.toThrow('There are not enough rights to delete the avatar');
    });

    it('should call chatRepository.removeAvatarFromStorage', async () => {
      const avatarPathToDelete = avatarUrlToDelete
        .split('/')
        .slice(-3)
        .join('/');
      await chatsService.deleteChatAvatar(chatId, avatarUrlToDelete);

      expect(chatRepository.removeAvatarFromStorage).toHaveBeenCalledWith(
        avatarPathToDelete,
      );
    });

    it('should return currentChatAvatar if avatar to delete is not current', async () => {
      newAvatarUrl = await chatsService.deleteChatAvatar(
        chatId,
        avatarUrlToDelete,
      );

      expect(newAvatarUrl).toBe(currentChatAvatar);
    });

    describe('when the deleted avatar is the current avatar', () => {
      const newAvatar =
        'https://wppewaapojghqafjsuvm.supabase.co/storage/v1/object/public/avatars/chats/1/new.png';
      beforeEach(async () => {
        chatRepository.getAvatarPublicUrl.mockResolvedValue(newAvatar);
        newAvatarUrl = await chatsService.deleteChatAvatar(
          chatId,
          currentChatAvatar,
        );
      });

      it('should call chatRepository.getChatAvatars', async () => {
        expect(chatRepository.getChatAvatars).toHaveBeenCalledWith(chatId);
      });

      it('should call chatRepository.getAvatarPublicUrl', async () => {
        expect(chatRepository.getAvatarPublicUrl).toHaveBeenCalledWith(
          chatId,
          chatAvatars[0].name,
        );
      });

      it('should call chatRepository.updateGroupChatAvatar', async () => {
        expect(chatRepository.updateGroupChatAvatar).toHaveBeenCalledWith(
          chatId,
          newAvatarUrl,
        );
      });

      it('should return newAvatarUrl', async () => {
        expect(newAvatarUrl).toBe(newAvatar);
      });
    });
  });
});
