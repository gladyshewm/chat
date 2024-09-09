import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { JwtHttpAuthGuard } from 'auth/guards/jwt-http-auth.guard';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    findUsers: jest.fn(),
    uploadAvatar: jest.fn(),
    getUserAvatar: jest.fn(),
    getUserAllAvatars: jest.fn(),
    deleteAvatar: jest.fn(),
    changeCredentials: jest.fn(),
  };

  const mockJwtHttpAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(JwtHttpAuthGuard)
      .useValue(mockJwtHttpAuthGuard)
      .compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });
});
