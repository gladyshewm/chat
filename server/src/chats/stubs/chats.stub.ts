import {
  AvatarInfo,
  ChatWithoutMessages,
  UserWithAvatar,
} from 'generated_graphql';

export const userWithAvatarStub = (id = 'mockId'): UserWithAvatar => {
  return {
    id,
    name: 'string',
    avatarUrl: 'Nullable<string>',
  };
};

export const chatWithoutMessagesStub = (
  name = 'mockName',
  userUuid = 'mockUserUuid',
  participants = [userWithAvatarStub(), userWithAvatarStub()],
): ChatWithoutMessages => {
  return {
    id: 'string',
    name,
    userUuid,
    isGroupChat: false,
    groupAvatarUrl: 'Nullable<string>',
    participants,
    createdAt: new Date('2024-09-09T18:13:11.180Z'),
  };
};

export const chatAvatarStub = (name = 'mockAvatarName'): AvatarInfo => {
  return {
    url: 'http://mockUrl.com',
    name,
    createdAt: new Date('2024-09-09T18:13:11.180Z'),
  };
};
