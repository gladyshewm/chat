import { Test, TestingModule } from '@nestjs/testing';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { AuthModule } from 'auth/auth.module';
import { JwtHttpAuthGuard } from 'auth/guards/jwt-http-auth.guard';

// jest.mock('./chats.service');

describe('ChatsResolver', () => {
  let chatsResolver: ChatsResolver;
  let chatsService: jest.Mocked<ChatsService>;

  const mockChatsService = {
    createChat: jest.fn(),
  };

  const mockJwtHttpAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsResolver,
        { provide: ChatsService, useValue: mockChatsService },
      ],
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
});
