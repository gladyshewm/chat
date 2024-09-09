import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { MESSAGE_REPOSITORY } from './messages.repository';
import { ChatsService } from 'chats/chats.service';
import { PUB_SUB } from 'common/pubsub/pubsub.provider';
import { FilesService } from 'files/files.service';

describe('MessagesService', () => {
  let messagesService: MessagesService;

  const mockChatsService = {};

  const mockMessagesRepository = {};

  const mockPubSub = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
  };

  const mockFilesService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: ChatsService, useValue: mockChatsService },
        { provide: MESSAGE_REPOSITORY, useValue: mockMessagesRepository },
        { provide: PUB_SUB, useValue: mockPubSub },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile();

    messagesService = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(messagesService).toBeDefined();
  });
});
