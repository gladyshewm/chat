import { Test, TestingModule } from '@nestjs/testing';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { PUB_SUB } from 'common/pubsub/pubsub.provider';
import { JwtHttpAuthGuard } from 'auth/guards/jwt-http-auth.guard';
import { JwtWsAuthGuard } from 'auth/guards/jwt-ws-auth.guard';

describe('MessagesResolver', () => {
  let messagesResolver: MessagesResolver;

  const mockMessagesService = {};

  const mockPubSub = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
  };

  const mockJwtHttpAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockJwtWSAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesResolver,
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: PUB_SUB, useValue: mockPubSub },
      ],
    })
      .overrideGuard(JwtHttpAuthGuard)
      .useValue(mockJwtHttpAuthGuard)
      .overrideGuard(JwtWsAuthGuard)
      .useValue(mockJwtWSAuthGuard)
      .compile();

    messagesResolver = module.get<MessagesResolver>(MessagesResolver);
  });

  it('should be defined', () => {
    expect(messagesResolver).toBeDefined();
  });
});
