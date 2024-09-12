import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { CHAT_REPOSITORY, ChatRepository } from './chats.repository';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';

// jest.mock('./chats.repository');
jest.mock('../users/users.service');
jest.mock('../files/files.service');

describe('ChatsService', () => {
  let chatsService: ChatsService;
  let usersService: UsersService;
  let filesService: FilesService;

  const chatRepository = {
    isParticipant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        UsersService,
        FilesService,
        { provide: CHAT_REPOSITORY, useValue: chatRepository },
      ],
    }).compile();

    chatsService = module.get<ChatsService>(ChatsService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
    filesService = module.get<jest.Mocked<FilesService>>(FilesService);
  });

  it('should be defined', () => {
    expect(chatsService).toBeDefined();
  });

  describe('isParticipant', () => {
    const userUuid = 'testUserUuid';
    const chatId = 'testChatId';

    it('should call chatRepository.isParticipant', async () => {
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
});
