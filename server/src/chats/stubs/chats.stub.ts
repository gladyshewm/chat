import {
  AvatarInfo,
  ChatWithoutMessages,
  UserWithAvatar,
} from 'generated_graphql';
import {
  ChatData,
  ChatWithParticipantsData,
  GroupAvatarData,
  PartyItem,
  ProfileData,
} from '../models/chats.model';

export const userWithAvatarStub = (id = 'mockId'): UserWithAvatar => ({
  id,
  name: 'string',
  avatarUrl: 'Nullable<string>',
});

export const chatWithoutMessagesStub = (
  id = 'mockId',
  name = 'mockName',
  userUuid = 'mockUserUuid',
  participants = [userWithAvatarStub(), userWithAvatarStub()],
  isGroupChat = false,
): ChatWithoutMessages => ({
  id,
  name,
  userUuid,
  isGroupChat,
  groupAvatarUrl: null,
  participants,
  createdAt: new Date('2024-09-09T18:13:11.180Z'),
});

export const chatAvatarStub = (name = 'mockAvatarName'): AvatarInfo => ({
  url: 'http://mockUrl.com',
  name,
  createdAt: new Date('2024-09-09T18:13:11.180Z'),
});

export const chatDataStub = (
  chat_id = 'mockId',
  name = 'mockName',
  user_uuid = 'mockUserUuid',
  is_group_chat = false,
): ChatData => ({
  chat_id,
  user_uuid,
  name,
  is_group_chat,
  created_at: new Date('2024-09-09T18:13:11.180Z'),
});

export const profileDataStub = (
  uuid = 'mockUuid',
  name = 'mockName',
  avatar_url = 'http://mockUrl.com',
): ProfileData => ({
  uuid,
  name,
  avatar_url,
});

export const chatWithParticipantsDataStub = (
  chatData: ChatData = chatDataStub(),
  profiles: ProfileData = profileDataStub(),
  groupAvatarUrl = 'http://mockUrl.com',
): ChatWithParticipantsData => {
  const chat = {
    ...(chatData || chatDataStub()),
    group_chat: {
      avatar_url: groupAvatarUrl,
    },
  };

  return {
    chat,
    profiles,
  };
};

export const partyItemStub = (
  chat: ChatData = chatDataStub(),
  profiles: ProfileData = profileDataStub(),
): PartyItem => {
  return {
    chat_id: 'string',
    chat,
    profiles,
  };
};

export const groupAvatarDataStub = (
  chat_id = 'mockId',
  avatar_url = 'http://mockUrl.com',
): GroupAvatarData => ({
  chat_id,
  avatar_url,
});
