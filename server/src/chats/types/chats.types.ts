export type Profile = {
  uuid: string;
  name: string;
  avatar_url?: string;
};

export type Chat = {
  chat_id: string;
  name: string;
};

export type PartyItem = {
  chat_id: string;
  chat: Chat;
  profiles: Profile;
};

export type MessageData = {
  message_id: string;
  chat_id: string;
  user_uuid: string;
  content: string;
  created_at: string;
  is_read: boolean;
  profiles: {
    name: string;
    avatar_url: string;
  };
};
