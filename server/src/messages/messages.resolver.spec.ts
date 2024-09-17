import { Test, TestingModule } from '@nestjs/testing';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { PUB_SUB } from 'common/pubsub/pubsub.provider';
import { JwtHttpAuthGuard } from 'auth/guards/jwt-http-auth.guard';
import { JwtWsAuthGuard } from 'auth/guards/jwt-ws-auth.guard';
import { Message } from '../generated_graphql';
import { attachedFileStub, messageStub } from './stubs/messages.stub';
import { fileUploadStub } from '../chats/stubs/files.stub';

jest.mock('./messages.service');

describe('MessagesResolver', () => {
  let messagesResolver: MessagesResolver;
  let messagesService: jest.Mocked<MessagesService>;

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
        MessagesService,
        { provide: PUB_SUB, useValue: mockPubSub },
      ],
    })
      .overrideGuard(JwtHttpAuthGuard)
      .useValue(mockJwtHttpAuthGuard)
      .overrideGuard(JwtWsAuthGuard)
      .useValue(mockJwtWSAuthGuard)
      .compile();

    messagesResolver = module.get<MessagesResolver>(MessagesResolver);
    messagesService = module.get<jest.Mocked<MessagesService>>(MessagesService);
  });

  it('should be defined', () => {
    expect(messagesResolver).toBeDefined();
  });

  describe('getChatMessages', () => {
    let chatMessages: Message[];
    const chatId = 'testChatId';
    const userUuid = 'testUserUuid';
    const limit = 10;
    const offset = 0;
    const messages = [
      messageStub('mesId1', 'chatId1', 'content1'),
      messageStub('mesId2', 'chatId2', 'content2'),
    ];

    beforeEach(async () => {
      messagesService.getChatMessages.mockResolvedValue(messages);
      chatMessages = await messagesResolver.getChatMessages(
        chatId,
        userUuid,
        limit,
        offset,
      );
    });

    it('should call messagesService.getChatMessages with correct data', async () => {
      expect(messagesService.getChatMessages).toHaveBeenCalledWith(
        chatId,
        userUuid,
        limit,
        offset,
      );
    });

    it('should return messages', async () => {
      expect(chatMessages).toEqual(messages);
    });

    it('should return correct message structure', () => {
      expect(chatMessages[0]).toHaveProperty('id');
      expect(chatMessages[0]).toHaveProperty('chatId');
      expect(chatMessages[0]).toHaveProperty('userId');
      expect(chatMessages[0]).toHaveProperty('userName');
      expect(chatMessages[0]).toHaveProperty('content');
      expect(chatMessages[0]).toHaveProperty('avatarUrl');
      expect(chatMessages[0]).toHaveProperty('createdAt');
    });

    it('should return correct number of messages', () => {
      expect(chatMessages.length).toBe(messages.length);
    });

    it('should propagate error if messagesService.getChatMessages throws an error', () => {
      messagesService.getChatMessages.mockRejectedValue(
        new Error('Service Error'),
      );
      expect(
        messagesResolver.getChatMessages(chatId, userUuid, limit, offset),
      ).rejects.toThrow('Service Error');
    });

    //TODO: это в сервис
    /* it('should return correct number of messages', async () => {
      const messages = [...Array(15)].map((_, i) =>
        messageStub(`mesId${i}`, `chatId${i}`, `content${i}`),
      );
      messagesService.getChatMessages.mockResolvedValue(messages);
      chatMessages = await messagesResolver.getChatMessages(
        chatId,
        userUuid,
        limit,
        offset,
      );

      expect(chatMessages.length).toBeLessThanOrEqual(limit);
    }); */
  });

  describe('findMessages', () => {
    let chatMessages: Message[];
    const chatId = 'testChatId';
    const query = 'TESTcontent2';
    const messages = [
      messageStub('mesId1', 'testChatId', 'content1'),
      messageStub('mesId2', 'testChatId', 'testContent2'),
      messageStub('mesId3', 'testChatId', 'TEStCONTENT2'),
    ];
    const found = messages.filter(
      (m) => m.content?.toLowerCase() === query.toLowerCase(),
    );

    beforeEach(async () => {
      messagesService.findMessages.mockResolvedValue(found);
      chatMessages = await messagesResolver.findMessages(chatId, query);
    });

    it('should call messagesService.findMessages', async () => {
      expect(messagesService.findMessages).toHaveBeenCalledWith(chatId, query);
    });

    it('should return found messages', async () => {
      expect(chatMessages).toEqual(found);
    });

    it('should return empty array if no messages found', async () => {
      messagesService.findMessages.mockResolvedValue([]);
      chatMessages = await messagesResolver.findMessages(chatId, query);

      expect(chatMessages).toEqual([]);
    });

    it('should propagate error if messagesService.findMessages throws an error', () => {
      messagesService.findMessages.mockRejectedValue(
        new Error('Service Error'),
      );
      expect(messagesResolver.findMessages(chatId, query)).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe('sendMessage', () => {
    let sentMessage: Message;
    const chatId = 'testChatId';
    const content = 'testContent';
    const userUuid = 'testUserUuid';
    const attachedFiles = [
      attachedFileStub('fileId1', 'fileUrl1', 'fileName1'),
      attachedFileStub('fileId2', 'fileUrl2', 'fileName2'),
    ];
    const uploadedFiles = attachedFiles.map((f) => fileUploadStub(f.fileName));
    const message = messageStub('messageId', chatId, content, attachedFiles);

    beforeEach(async () => {
      messagesService.sendMessageSub.mockResolvedValue(message);
      sentMessage = await messagesResolver.sendMessage(
        chatId,
        content,
        uploadedFiles,
        userUuid,
      );
    });

    it('should call messagesService.sendMessageSub with correct data', async () => {
      expect(messagesService.sendMessageSub).toHaveBeenCalledWith(
        chatId,
        userUuid,
        content,
        uploadedFiles,
      );
    });

    it('should return sent message', async () => {
      expect(sentMessage).toEqual(message);
    });

    it('should propagate error if messagesService.sendMessageSub throws an error', () => {
      messagesService.sendMessageSub.mockRejectedValue(
        new Error('Service Error'),
      );
      expect(
        messagesResolver.sendMessage(chatId, content, uploadedFiles, userUuid),
      ).rejects.toThrow('Service Error');
    });
  });

  describe('messageSent', () => {
    const iterator = 'asyncIterator';
    let result: any; /* AsyncIterator<Message> */

    beforeEach(() => {
      mockPubSub.asyncIterator.mockReturnValue(iterator);
      result = messagesResolver.messageSent();
    });

    it('should call pubSub.asyncIterator', () => {
      expect(mockPubSub.asyncIterator).toHaveBeenCalledWith('messageSent');
    });

    it('should return iterator', () => {
      expect(result).toEqual(iterator);
    });

    it('should be guarded by JwtWsAuthGuard', () => {
      const guardType = Reflect.getMetadata(
        '__guards__',
        MessagesResolver.prototype.messageSent,
      );

      expect(guardType).toContain(JwtWsAuthGuard);
    });

    //filter
  });

  describe('sendTypingStatus', () => {
    const chatId = 'testChatId';
    const userName = 'testUserName';
    const isTyping = true;

    beforeEach(() => {
      mockPubSub.publish.mockClear();
      messagesResolver.sendTypingStatus(chatId, userName, isTyping);
    });

    it('should call pubSub.publish with correct data', () => {
      expect(mockPubSub.publish).toHaveBeenCalledWith('userTyping', {
        userTyping: { chatId, userName, isTyping },
      });
    });

    it('should return typing feedback', () => {
      expect(
        messagesResolver.sendTypingStatus(chatId, userName, isTyping),
      ).toEqual({ chatId, userName, isTyping });
    });
  });

  describe('userTyping', () => {
    const iterator = 'asyncIterator';
    let result: any;

    beforeEach(() => {
      mockPubSub.asyncIterator.mockReturnValue(iterator);
      result = messagesResolver.userTyping();
    });

    it('should call pubSub.asyncIterator', () => {
      expect(mockPubSub.asyncIterator).toHaveBeenCalledWith('userTyping');
    });

    it('should return iterator', () => {
      expect(result).toEqual(iterator);
    });
  });
});
