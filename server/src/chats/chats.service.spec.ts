import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { UsersService } from 'users/users.service';
import { FilesService } from 'files/files.service';
import { CHAT_REPOSITORY } from './chats.repository';

describe('ChatsService', () => {
  let chatsService: ChatsService;

  const mockUsersService = {
    findUserById: jest.fn(),
  };

  const mockFilesService = {};

  const mockChatRepository = {
    createChat: jest.fn(),
    deleteChat: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: FilesService, useValue: mockFilesService },
        { provide: CHAT_REPOSITORY, useValue: mockChatRepository },
      ],
    }).compile();

    chatsService = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(chatsService).toBeDefined();
  });
});
