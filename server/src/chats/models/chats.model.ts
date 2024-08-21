export type ChatData = {
  chat_id: string;
  user_uuid: string;
  name: string;
  is_group_chat: boolean;
  created_at: Date;
};

export type ProfileData = {
  uuid: string;
  name: string;
  avatar_url?: string;
};

export type ChatWithParticipantsData = {
  chat: ChatData & { group_chat: { avatar_url?: string } };
  profiles: ProfileData;
};

export type PartyItem = {
  chat_id: string;
  chat: ChatData;
  profiles: ProfileData;
};

export type GroupAvatarData = {
  chat_id: string;
  avatar_url?: string;
};
