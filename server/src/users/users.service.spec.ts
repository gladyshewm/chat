import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { USER_REPOSITORY } from './users.repository';
import { FilesService } from 'files/files.service';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUsersRepository = {
    getAllUsers: jest.fn(),
    findUsers: jest.fn(),
    uploadAvatar: jest.fn(),
    getUserAvatar: jest.fn(),
    getUserAllAvatars: jest.fn(),
    deleteAvatar: jest.fn(),
    changeCredentials: jest.fn(),
  };

  const mockFilesService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: USER_REPOSITORY, useValue: mockUsersRepository },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
