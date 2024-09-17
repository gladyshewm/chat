import { AttachedFile, Message } from '../../generated_graphql';

export const attachedFileStub = (
  fileId = 'mockFileId',
  fileUrl = 'mockFileUrl',
  fileName = 'mockFileName',
): AttachedFile => ({
  fileId,
  fileUrl,
  fileName,
});

export const messageStub = (
  id = 'mockId',
  chatId = 'mockChatId',
  content = 'mockContent',
  attachedFiles: AttachedFile[] = [],
): Message => ({
  id,
  chatId,
  userId: 'string',
  userName: 'string',
  avatarUrl: 'string',
  content,
  createdAt: new Date('2024-09-09T18:13:11.180Z'),
  isRead: false,
  hasFiles: false,
  attachedFiles,
});
